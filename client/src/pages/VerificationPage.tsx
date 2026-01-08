import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useGameStore } from '../stores/useGameStore';
import { Button } from '../components/Button';
import { Camera, CheckCircle } from 'lucide-react';

export const VerificationPage = () => {
    const navigate = useNavigate();
    const uploadVerificationVideo = useGameStore((state) => state.uploadVerificationVideo);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const handleStartCapture = useCallback(() => {
        setIsCapturing(true);
        setRecordedChunks([]);
        if (webcamRef.current && webcamRef.current.video) {
            // @ts-ignore
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        }
    }, [webcamRef, setIsCapturing, setRecordedChunks]);

    const handleDataAvailable = useCallback(
        ({ data }: { data: Blob }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCapture = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsCapturing(false);
    }, [mediaRecorderRef, setIsCapturing]);

    const handleUpload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        }
    }, [recordedChunks]);

    const handleVerify = async () => {
        if (!videoUrl) {
            alert('Please record a video selfie!');
            return;
        }
        await uploadVerificationVideo(videoUrl);
        navigate('/quest');
    };

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 font-mono">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-4 text-center uppercase tracking-tighter">Verification</h1>
                <p className="text-center mb-8 text-sm">Record a quick video selfie to verify your identity</p>

                <div className="mb-6">
                    <div className="border-2 border-black bg-gray-100 h-64 flex items-center justify-center overflow-hidden relative">
                        {!videoUrl ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video src={videoUrl} controls className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="mt-2 flex gap-2">
                        {!isCapturing && !videoUrl && (
                            <Button onClick={handleStartCapture} className="flex-1 text-xs py-1">
                                <Camera size={16} className="mr-1" /> Start Recording
                            </Button>
                        )}
                        {isCapturing && (
                            <Button onClick={handleStopCapture} className="flex-1 text-xs py-1 bg-red-500 text-white border-red-700">
                                Stop Recording
                            </Button>
                        )}
                        {!isCapturing && recordedChunks.length > 0 && !videoUrl && (
                            <Button onClick={handleUpload} className="flex-1 text-xs py-1 bg-green-500 text-white border-green-700">
                                Confirm Video
                            </Button>
                        )}
                        {videoUrl && (
                            <Button onClick={() => { setVideoUrl(null); setRecordedChunks([]); }} className="flex-1 text-xs py-1">
                                Retake
                            </Button>
                        )}
                    </div>
                    {/* Debug Button for Testing */}
                    <div className="mt-2 text-center">
                        <button onClick={() => setVideoUrl('mock-verification-url')} className="text-xs underline text-gray-500">Debug: Mock Video</button>
                    </div>
                </div>

                <Button onClick={handleVerify} disabled={!videoUrl} className="w-full py-3 text-lg">
                    <CheckCircle className="mr-2" /> VERIFY & CONTINUE
                </Button>
            </div>
        </div>
    );
};
