// const scriptZIP = document.createElement("script");
// scriptZIP.src = "https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js";
// document.head.appendChild(scriptZIP);

// await loadJSZip();

fetch("https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js")
    .then(response => response.text())
    .then(jsCode => {
        eval(jsCode);


        var yschsp = document.getElementById("yschsp");
        var value = yschsp.value.replace("logo", "").trim()

        getImageData(value);
    })
    .catch(error => console.error(error));

function getImageData(logoName) {
    // await loadJSZip();

    var body = document.getElementsByClassName("sres-cntr")[0];
    var listImg = body.getElementsByTagName("img");

    // Create a new JSZip instance
    const zip = new JSZip();

    // Define an array to store the Promises that will be used to load the image data
    const imagePromises = [];

    listImg = Array.from(listImg).filter((image) => {
        return image.src.includes("https");
    });

    // Iterate over each image element and add a Promise that resolves to its binary data to the imagePromises array
    for (let i = 0; i < listImg.length; i++) {
        const image = listImg[i];

        const promise = new Promise((resolve, reject) => {
            fetch(image.src)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result.split(',')[1];
                        resolve({
                            filename: logoName + "_" + i + ".jpeg",
                            data: base64data,
                        });
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => reject(error));
        });
        imagePromises.push(promise);
    }

    // Wait for all of the image data Promises to resolve, then create the zip file and initiate the download
    Promise.all(imagePromises)
        .then((imagesData) => {
            imagesData.forEach((imageData) => {
                zip.file(imageData.filename, imageData.data, { base64: true });
            });
            zip
                .generateAsync({ type: "blob" })
                .then((content) => {
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(content);
                    downloadLink.download = logoName + ".zip";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                })
                .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
}



