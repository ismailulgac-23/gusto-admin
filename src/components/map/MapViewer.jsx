"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MapViewer({ 
    latitude, 
    longitude, 
    address,
    title = "Konum",
    height = "400px" 
}) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        return (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800">
                <Icon icon="ri:map-pin-line" className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Koordinat bilgisi bulunamadı</p>
            </div>
        );
    }

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const getGoogleMapsUrl = () => {
        // Google Maps Embed API - marker otomatik olarak koordinatlara göre eklenir
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
        if (apiKey) {
            // Embed API'de q parametresi otomatik olarak marker ekler
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15&maptype=roadmap`;
        }
        // API key yoksa - marker otomatik olarak koordinatlara göre eklenir
        return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&ll=${lat},${lng}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {title}
                </label>
                <button
                    type="button"
                    onClick={openInGoogleMaps}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Icon icon="ri:external-link-line" className="text-base" />
                    Google Maps'te Aç
                </button>
            </div>
            
            <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <iframe
                    key={`${lat}-${lng}`}
                    width="100%"
                    height={height}
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getGoogleMapsUrl()}
                />
            </div>
            
            {address && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                        <Icon icon="ri:map-pin-line" className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Adres</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{address}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <Icon icon="ri:map-pin-line" className="text-base" />
                    <span>Enlem: {lat.toFixed(6)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Icon icon="ri:map-pin-line" className="text-base" />
                    <span>Boylam: {lng.toFixed(6)}</span>
                </div>
            </div>
        </div>
    );
}

