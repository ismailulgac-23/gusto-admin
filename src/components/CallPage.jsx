"use client";
import React, { useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useUserStore } from '@/context/UserContext';

export default function CallPage({ roomId }) {
    const roomID = roomId;
    const userStore = useUserStore();
    const callContainerRef = useRef(null);
    const joinedRef = useRef(false);

    useEffect(() => {
        // userStore.user yüklendiğinde ve container hazır olduğunda bir kez joinRoom çağır
        if (callContainerRef.current && !joinedRef.current && userStore.user) {
            joinedRef.current = true;
            const appID = 135144395;
            const serverSecret = "437e0d0041a1566df8050f0a5ff45216";
            // userID ve userName Flutter ile aynı olmalı
            const userID = userStore.user.id;
            const userName = userStore.user.name;

            // Test için token üretimi
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomID,
                userID,
                userName
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zp.joinRoom({
                container: callContainerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                    config: {
                        liveStreamingMode: ZegoUIKitPrebuilt.OneONoneCall
                    }
                },
                onJoinRoom: (room) => {
                    // Call joined
                }
            });
        }
    }, [roomID, userStore.user]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-6 max-w-[1440px] w-full shadow-xl border border-gray-200 dark:border-gray-700 h-[80%]">
                <div
                    className="myCallContainer"
                    ref={callContainerRef}
                    style={{ width: '100%', height: '100%' }}
                ></div>
            </div>
        </div>
    );
}
