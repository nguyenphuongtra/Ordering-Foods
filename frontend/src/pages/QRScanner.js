// pages/QRScanner.jsx
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { useCart } from '../contexts/CartContext'
import { cleanId } from '../utils/cleanId'
export default function QRScanner() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTableId } = useCart()

  // Nếu URL đã có tableId, chuyển thẳng
  useEffect(() => {
    const t = searchParams.get('tableId')
    if (t) navigate(`/menu/${t}`)
  }, [searchParams, navigate])

  useEffect(() => {
    const qrRegionId = "qr-reader"
    const html5QrCode = new Html5Qrcode(qrRegionId)

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        try {
          const url = new URL(decodedText)
          const raw = url.searchParams.get('tableId');
          const tableId = cleanId(raw);
          if (tableId) {
            html5QrCode.stop()
                .then(() => {
                    setTableId(tableId);
                    localStorage.setItem('tableId', tableId);
                    navigate(`/menu/${tableId}`);
            })
          }
        } catch (e) {
          console.warn("Không phải QR hợp lệ:", decodedText)
        }
      },
      (errorMessage) => {
        // console.log("Scan lỗi:", errorMessage)
      }
    ).catch(err => console.error("Không thể khởi động QR scanner:", err))

    // cleanup khi unmount
    return () => {
      html5QrCode.stop().catch(() => {})
    }
  }, [navigate])

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Quét mã QR để đặt món</h2>
      <div id="qr-reader" style={{ width: "100%", maxWidth: 400, margin: "0 auto" }} />
    </div>
  )
}
