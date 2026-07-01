import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { transaction_id, amount } = await req.json();
    
    const API_KEY = "mepay-secret-key-123"; 
    const MID = "ID123456"; 

    const url = `http://192.168.100.10:5000/restapi/qris/show_qris.php?do=create-invoice&apikey=${API_KEY}&mID=${MID}&cliTrxNumber=${transaction_id}&cliTrxAmount=${amount}`;
    
    console.log("URL yang dikirim:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("=== RESPONSE DARI SIMULATOR ===");
    console.log(JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error di route QRIS:", error);
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}