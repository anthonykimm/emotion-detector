'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ApproachabilityFeedback from "./components/Approachability";

const Webcam = dynamic(() => import('react-webcam'), {
    ssr: false,
});

export default function Home() {
    const webcamRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [emotionResults, setEmotionResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };

    useEffect(() => {
        // Request camera permission when component mounts
        const requestCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasWebcamPermission(true);
                // Make sure to stop the stream to allow the Webcam component to take over
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                setError('Could not access webcam. Please ensure you have given permission.');
                console.error('Webcam permission error:', err);
            }
        };

        requestCameraPermission();
    }, []);

    const handleUserMedia = useCallback((stream) => {
        setHasWebcamPermission(true);
        setIsCameraReady(true);
        setError(null);
    }, []);

    const handleUserMediaError = useCallback((err) => {
        setHasWebcamPermission(false);
        setIsCameraReady(false);
        setError('Could not access webcam. Please ensure you have given permission and no other app is using it.');
        console.error('Webcam error:', err);
    }, []);

    const processFrame = useCallback(async () => {
        if (!webcamRef.current || !isActive || isProcessing || !isCameraReady) return;

        try {
            setIsProcessing(true);
            const imageSrc = webcamRef.current.getScreenshot();

            if (!imageSrc) return;

            const response = await fetch('http://localhost:8000/api/detect/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageSrc })
            });

            if (!response.ok) {
                throw new Error('Failed to detect emotion');
            }

            const data = await response.json();
            setEmotionResults(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setIsActive(false);
        } finally {
            setIsProcessing(false);
        }
    }, [isActive, isProcessing, isCameraReady]);

    useEffect(() => {
        let intervalId;

        if (isActive && isCameraReady) {
            intervalId = setInterval(processFrame, 500);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive, processFrame, isCameraReady]);

    const toggleDetection = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setError(null);
            setEmotionResults(null);
        }
    };

    const EmotionBar = ({ emotion, score }) => (
        <div className="mb-2">
            <div className="flex justify-between mb-1">
                <span className="capitalize">{emotion}</span>
                <span>{(score).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded">
                <div
                    className="bg-blue-500 rounded h-2 transition-all duration-300"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded min-h-[480px] flex items-center justify-center">
                        {!hasWebcamPermission ? (
                            <div className="text-center p-4">
                                <p>Camera permission is required.</p>
                                <button
                                    onClick={() => navigator.mediaDevices.getUserMedia({ video: true })}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Enable Camera
                                </button>
                            </div>
                        ) : (
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                onUserMedia={handleUserMedia}
                                onUserMediaError={handleUserMediaError}
                                className="w-full rounded"
                            />
                        )}
                    </div>

                    {isCameraReady && (
                        <button
                            onClick={toggleDetection}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition-colors ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {isActive ? 'Stop Detection' : 'Start Detection'}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {error ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    ) : emotionResults ? (
                        <div className="p-4 bg-white rounded shadow">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-4">Detected Emotions:</h3>
                                {Object.entries(emotionResults.emotions).map(([emotion, score]) => (
                                    <EmotionBar key={emotion} emotion={emotion} score={score} />
                                ))}
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">Dominant Emotion:</span>
                                    <span className="capitalize bg-blue-100 px-2 py-1 rounded">
                                        {emotionResults.dominant_emotion}
                                    </span>
                                </div>
                            </div>

                            <ApproachabilityFeedback emotions={emotionResults.emotions} />
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-100 rounded text-center">
                            {isCameraReady ?
                                'Press \'Start Detection\' to begin emotion analysis' :
                                'Waiting for camera initialization...'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
