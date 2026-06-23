"use client";

// Tipe data sementara untuk mendefinisikan bentuk pesanan (nanti disesuaikan dengan Firestore)
export interface QueuedOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName?: string;
  items: { name: string; quantity: number }[];
  totalPrice: number;
  timestamp: string;
}

interface PaymentQueueCardProps {
  order: QueuedOrder;
  onConfirmPayment?: (orderId: string) => void;
}

export default function PaymentQueueCard({
  order,
  onConfirmPayment,
}: PaymentQueueCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      {/* Bagian Header: Nomor Meja & Waktu */}
      <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
            {order.tableNumber}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {order.orderNumber}
          </span>
        </div>
        <span className="text-xs font-medium text-gray-400">
          {order.timestamp}
        </span>
      </div>

      {/* Bagian Tengah: Daftar Pesanan */}
      <div className="p-5 flex-1 flex flex-col">
        {order.customerName && (
          <p className="text-sm text-gray-500 mb-3 font-medium">
            Atas Nama:{" "}
            <span className="text-gray-800">{order.customerName}</span>
          </p>
        )}

        <ul className="space-y-2 mb-4 flex-1">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 line-clamp-1 pr-2">
                {item.quantity}x {item.name}
              </span>
            </li>
          ))}
          {/* Jika item terlalu banyak, bisa dibatasi tampilannya nanti */}
        </ul>

        {/* Garis Pemisah */}
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500 font-medium">
            Total Tagihan
          </span>
          <span className="text-lg font-bold text-red-600">
            Rp {order.totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Bagian Bawah: Tombol Aksi */}
      <div className="px-5 pb-5 pt-0">
        <button
          onClick={() => onConfirmPayment && onConfirmPayment(order.id)}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors active:scale-[0.98]"
        >
          Konfirmasi Lunas
        </button>
      </div>
    </div>
  );
}
