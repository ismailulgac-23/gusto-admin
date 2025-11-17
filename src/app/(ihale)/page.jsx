"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import ModeratorProfileCard from "@/components/ModeratorProfileCard";
import axios from "@/axios";
import { useUserStore } from "@/context/UserContext";

export default function Ecommerce() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userStore = useUserStore();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admin/statistics');

        if (!response.status === 200) {
          throw new Error('Failed to fetch statistics');
        }

        const data = response.data.data || response.data;
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics statistics={statistics?.statistics || {}} />
      </div>

      {!userStore.user?.isModerator && (
        <>
          <div className="col-span-12">
            <MonthlySalesChart monthlyTransactions={statistics?.monthlyTransactions || []} />
          </div>
          <div className="col-span-12">
            <RecentOrders lastTenUsers={statistics?.lastTenUsers || []} />
          </div>
        </>
      )}
      {userStore.user?.isModerator && (
        <div className="col-span-12 space-y-6">
          <ModeratorProfileCard user={userStore.user} />
        </div>
      )}
    </div>
  );
}
