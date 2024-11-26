// Some parts and ideas from https://github.com/codepo8/videograbber
let f;

window.addEventListener("load", function () {
  const domElement = document.getElementById("main");
  const feedbackElement = document.getElementById("feedback");
  const videoElement = document.getElementById("video");
  let fileName = "Video";

  const callback = (file) => {
    console.log(file);
    fileName = file.name;
    videoElement.src = URL.createObjectURL(file);
    videoElement.focus();
  };
  registerFileDragDrop(domElement, feedbackElement, callback);

  function download(fileFormat) {
    console.log("Downloading", fileFormat);
    const canvas = document.getElementById("canvas");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    ctx = canvas.getContext("2d");
    ctx.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight,
    );

    let outputFileNameStem;
    if (fileName.indexOf(".") === -1) {
      outputFileNameStem = fileName;
    } else {
      const parts = fileName.split(".");
      parts.splice(parts.length - 1);
      outputFileNameStem = parts.join(".");
    }

    const a = document.createElement("a");
    a.download = `${outputFileNameStem} @${formatTime(videoElement.currentTime)}.${fileFormat}`;
    a.href = canvas.toDataURL(`image/${fileFormat}`);
    a.click();
  }

  videoElement.addEventListener("keydown", (e) => {
    if (e.code === "KeyK") {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
      return;
    }
    if (!e.shiftKey) {
      return;
    }
    const absDelta = e.altKey ? 1 / 60 : 1;
    switch (e.code) {
      case "KeyL": {
        videoElement.pause();
        videoElement.currentTime += absDelta;
        break;
      }
      case "KeyH":
      // `H` matches `vim`, but YouTube uses `J`. We support `H` as a fallback depending on which muscle memory is invoked.
      // fallthrough
      case "KeyJ": {
        videoElement.pause();
        videoElement.currentTime -= absDelta;
        break;
      }
      default:
        return;
    }
    e.preventDefault();
  });

  document
    .getElementById("jpeg")
    .addEventListener("click", download.bind(this, "jpeg"));
  document
    .getElementById("png")
    .addEventListener("click", download.bind(this, "png"));
});

formatTime = (time) => {
  // Each entry is [minimum number of digits if not first, separator before, value]
  const hours = Math.floor(time / (60 * 60 * 1));
  const minutes = Math.floor(time / (60 * 1)) % 60;
  const seconds = Math.floor(time / 1) % 60;

  /**
   * @param {integer} number
   * @param {integer} numDigitsAfterPadding
   */
  function pad(number, numDigitsAfterPadding) {
    let output = `${number}`;
    while (output.length < numDigitsAfterPadding) {
      output = `0${output}`;
    }
    return output;
  }

  let secFirstString = "";
  let secRestString;
  if (hours > 0) {
    secRestString = `${pad(hours, 2)}-${pad(minutes, 2)}-${pad(seconds, 2)}`;
  } else if (minutes > 0) {
    secRestString = `${minutes}-${pad(seconds, 2)}`;
  } else {
    secRestString = `${seconds}`;
    if (secRestString[0] === "1") {
      secFirstString = "1";
      secRestString = secRestString.substr(1);
    }
  }

  const centiseconds = Math.floor(((time * 1000) % 1000) / 10);

  return `${secFirstString + secRestString}.${pad(centiseconds, 2)}`;
};
