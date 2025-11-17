import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Link from "next/link";

// Define the TypeScript interface for the user data
interface User {
  id: string;
  name: string | null;
  phoneNumber: string;
  email: string | null;
  userType: "PROVIDER" | "RECEIVER";
  profileImage: string | null;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export default function RecentOrders({ lastTenUsers }: { lastTenUsers: User[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            En Son Kayıt Olan 10 Üye
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/users" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Tümünü Gör
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kullanıcı
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Rol
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Telefon
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Durum
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {lastTenUsers && lastTenUsers.length > 0 ? (
              lastTenUsers.map((user) => (
                <TableRow key={user.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {user.profileImage ? (
                          <Image
                            width={50}
                            height={50}
                            src={user.profileImage}
                            className="h-[50px] w-[50px] object-cover"
                            alt={user.name || 'Kullanıcı'}
                          />
                        ) : (
                          <span className="text-gray-400 text-lg">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name || '-'}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.email || user.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.userType === 'PROVIDER'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {user.userType === 'PROVIDER' ? 'Sağlayıcı' : 'Alıcı'}
                    </span>
                    {user.isAdmin && (
                      <span className="ml-2 text-xs text-blue-500">(Admin)</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={user.isActive ? "success" : "error"}
                    >
                      {user.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Henüz kullanıcı bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
