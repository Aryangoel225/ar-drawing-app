"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { useRouter } from 'next/router';


export default function Home() {
  const router = useRouter();
  const { url } = router.query; // Access the dynamic 'url' parameter

  
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import the model-viewer script
    const script = document.createElement("script")
    script.src = "https://unpkg.com/@google/model-viewer@3.3.0/dist/model-viewer.min.js"
    script.type = "module"
    script.onload = () => setModelViewerLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">3D Model Viewer with AR</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {modelViewerLoaded ? (
            <div className="relative w-full h-[500px] bg-gray-100">
              {/* @ts-ignore - model-viewer is a custom element */}
              <model-viewer
                src={url}
                alt="A 3D model of a duck"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                shadow-intensity="1"
                auto-rotate
                ar-scale="fixed"
                style={{ width: "100%", height: "100%" }}
              ></model-viewer>
            </div>
          ) : (
            <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading 3D viewer...</p>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">Rubber Duck Model</h2>
                <p className="text-gray-600 mt-1">Interact with the 3D model and view it in AR</p>
              </div>

              {modelViewerLoaded && (
                <Button
                  className="ar-button"
                  onClick={() => {
                    // This will be handled by model-viewer's AR button
                    const modelViewer = document.querySelector("model-viewer")
                    if (modelViewer) {
                      // @ts-ignore
                      modelViewer.activateAR()
                    }
                  }}
                >
                  View in AR
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">How to use:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Drag to rotate the model</li>
                  <li>Pinch or scroll to zoom</li>
                  <li>Click "View in AR" to see the model in your space</li>
                  <li>On mobile, you'll need to allow camera access</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

