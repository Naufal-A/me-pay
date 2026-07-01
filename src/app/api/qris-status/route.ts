import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { invoiceId, amount, requestDate } = await req.json();

    const API_KEY = "mepay-secret-key-123";
    const MID = "ID123456";

    const trxdate = requestDate.split(" ")[0];

    const url = `http://192.168.100.10:5000/restapi/qris/checkpaid_qris.php?do=checkStatus&apikey=${API_KEY}&mID=${MID}&invid=${invoiceId}&trxvalue=${amount}&trxdate=${trxdate}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("=== STATUS CHECK ===", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error cek status QRIS:", error);
    return NextResponse.json({ error: "Gagal cek status" }, { status: 500 });
  }
}