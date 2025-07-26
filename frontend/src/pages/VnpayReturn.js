import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../style/VnpayReturn.css';

const VnpayReturn = () => {
    const location = useLocation();
    const [message, setMessage] = useState('Đang xử lý...');
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');

        const details = {
            orderId: queryParams.get('vnp_TxnRef'),
            amount: (parseInt(queryParams.get('vnp_Amount')) / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            bankCode: queryParams.get('vnp_BankCode'),
            transactionNo: queryParams.get('vnp_TransactionNo'),
            payDate: queryParams.get('vnp_PayDate'),
        };

        if (vnp_ResponseCode === '00') {
            setMessage('Thanh toán thành công!');
            setIsSuccess(true);
            setTransactionDetails(details);
        } else {
            setMessage('Thanh toán không thành công. Vui lòng thử lại.');
            setIsSuccess(false);
        }
    }, [location]);

    return (
        <div className="vnpay-return-container">
            <div className="vnpay-return-card">
                <h1 className={isSuccess ? 'success-text' : 'error-text'}>
                    {message}
                </h1>
                {isSuccess && transactionDetails && (
                    <div className="transaction-details">
                        <h2>Chi tiết giao dịch</h2>
                        <p><strong>Mã đơn hàng:</strong> {transactionDetails.orderId}</p>
                        <p><strong>Số tiền:</strong> {transactionDetails.amount}</p>
                        <p><strong>Ngân hàng:</strong> {transactionDetails.bankCode}</p>
                        <p><strong>Mã giao dịch (VNPAY):</strong> {transactionDetails.transactionNo}</p>
                        <p><strong>Thời gian thanh toán:</strong> {transactionDetails.payDate}</p>
                    </div>
                )}
                <Link to="/" className="home-button">Quay về trang chủ</Link>
            </div>
        </div>
    );
};

export default VnpayReturn;
