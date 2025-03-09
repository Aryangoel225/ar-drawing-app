'use client';

import React, { useEffect, useRef, useState } from 'react';

const Camera: React.FC = () => {

  const [image, setImage] = useState<string | null>(null);
  const [importedImage, setImportedImage] = useState<string | null>(null); // State for imported image
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const startCamera = async (deviceId: string | null) => {
      try {
        const constraints = deviceId
          ? { video: { deviceId: { exact: deviceId } } }
          : { video: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (video) {
          video.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    startCamera(currentDeviceId);

    return () => {
      const stream = video?.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      tracks?.forEach(track => track.stop());
    };
  }, [currentDeviceId]);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/png');
        setImage(imgData);
      }
    }
  };

  const switchCamera = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    const newDeviceId = videoDevices.find(device => device.label.toLowerCase().includes('back'))?.deviceId
      || videoDevices.find(device => device.label.toLowerCase().includes('front'))?.deviceId;

    if (newDeviceId && newDeviceId !== currentDeviceId) {
      setCurrentDeviceId(newDeviceId);
    }
  };

  const submitDone = async () => {

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "image": importedImage }),
    };

    const request = await fetch("https://sktchpd.services.dylankainth.com/image-to-3d", requestOptions)

    const response = await request.json()

    console.log(response?.result)

    // console.log(result.data);
    // console.log(image)
    // const request = await fetch('https://sktchpd.services.dylankainth.com/call/shape_generation', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     'data': [
    //       'Hello!!',
    //       {
    //         'path': 'https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'
    //       },
    //       20,
    //       3,
    //       0,
    //       '256',
    //       true
    //     ]
    //   })
    // });

    // const response = await request.json()

    // console.log(response.output)

    //   const response = {
    //     "output": "https://segmind-inference-io.s3.amazonaws.com/meshes/d3265da1-a720-4fb8-8044-0e6fbadc2330.glb",
    //     "outputs": 0,
    //     "status": "success"
    // }

    // send the user to  /output/{response.output}

    // wait until the response is received
    window.location.href = `/pending?id=${response?.result}`



  }

  // Handle image import
  const handleImageImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImportedImage(reader.result as string); // Set the imported image
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold text-blue-600 mb-4">Take a Picture</h1>

      {/* Camera Feed */}
      <div className="flex justify-center mb-4">
        <video
          ref={videoRef}
          width="800"
          height="500"
          autoPlay
          className="border-2 border-gray-300 rounded-lg shadow-md"
        ></video>
      </div>

      {/* Take Picture Button */}
      <button
        onClick={takePicture}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Take Picture
      </button>

      {/* Switch Camera Button */}
      <button
        onClick={switchCamera}
        className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 mt-4"
      >
        Switch Camera
      </button>

      {/* Image Importer */}
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageImport}
          className="mb-4 p-2 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      {/* Display Imported Image */}
      {importedImage && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-green-600 mb-2">Imported Image</h2>
          <img
            src={importedImage}
            alt="Imported"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      )}

      {/* Display Captured Image */}
      {image && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-green-600 mb-2">Captured Image</h2>
          <img
            src={image}
            alt="Captured"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      )}

      <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>

      <button
        onClick={submitDone}
        className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 mt-4"
      >
        Submit
      </button>




    </div>
  );
};

export default Camera;