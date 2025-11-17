"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MapPicker({ 
    latitude, 
    longitude, 
    onLocationChange,
    height = "400px",
    readOnly = false 
}) {
    const [lat, setLat] = useState(latitude ? parseFloat(latitude) : 41.0082);
    const [lng, setLng] = useState(longitude ? parseFloat(longitude) : 28.9784);

    useEffect(() => {
        if (latitude && longitude) {
            const newLat = parseFloat(latitude);
            const newLng = parseFloat(longitude);
            if (!isNaN(newLat) && !isNaN(newLng)) {
                setLat(newLat);
                setLng(newLng);
            }
        }
    }, [latitude, longitude]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLat = position.coords.latitude;
                    const newLng = position.coords.longitude;
                    setLat(newLat);
                    setLng(newLng);
                    if (onLocationChange) {
                        onLocationChange(newLat, newLng);
                    }
                },
                (error) => {
                    alert('Konum alınamadı. Lütfen tarayıcı ayarlarınızdan konum iznini açın.');
                }
            );
        } else {
            alert('Tarayıcınız konum özelliğini desteklemiyor.');
        }
    };

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const getGoogleMapsUrl = () => {
        // Google Maps Embed API - marker otomatik olarak koordinatlara göre eklenir
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
        if (apiKey) {
            // Embed API'de q parametresi otomatik olarak marker ekler
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
        }
        // API key yoksa - marker otomatik olarak koordinatlara göre eklenir
        return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&ll=${lat},${lng}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Konum Seçimi
                </label>
                <div className="flex items-center gap-2">
                    {!readOnly && (
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Mevcut konumunuzu kullan"
                        >
                            <Icon icon="ri:crosshair-line" className="text-base" />
                            Konumumu Bul
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={openInGoogleMaps}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <Icon icon="ri:external-link-line" className="text-base" />
                        Google Maps'te Aç
                    </button>
                </div>
            </div>
            
            <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <iframe
                    key={`${lat}-${lng}`}
                    width="100%"
                    height={height}
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getGoogleMapsUrl()}
                    className="pointer-events-none"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enlem
                    </label>
                    <input
                        type="number"
                        value={lat.toFixed(6)}
                        onChange={(e) => {
                            const newLat = parseFloat(e.target.value) || 0;
                            setLat(newLat);
                            if (onLocationChange) {
                                onLocationChange(newLat, lng);
                            }
                        }}
                        step="any"
                        readOnly={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Boylam
                    </label>
                    <input
                        type="number"
                        value={lng.toFixed(6)}
                        onChange={(e) => {
                            const newLng = parseFloat(e.target.value) || 0;
                            setLng(newLng);
                            if (onLocationChange) {
                                onLocationChange(lat, newLng);
                            }
                        }}
                        step="any"
                        readOnly={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>
            
            {!readOnly && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Koordinatları manuel olarak girebilir veya "Konumumu Bul" butonunu kullanabilirsiniz
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        📍 Haritadaki kırmızı pin mevcut seçili konumu gösterir. Koordinatları değiştirdiğinizde harita otomatik güncellenir.
                    </p>
                </div>
            )}
        </div>
    );
}

