import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SBP from '../components/payments/SBP';
import Cards from '../components/payments/Cards';
import Ton from '../components/payments/Ton';

function Payment() {
  const navigate = useNavigate();
  const { paymentType } = useParams();
  console.log(paymentType)
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    if (["/payments/sbp", "/payments/cards", "/payments/ton"].includes(window.location.pathname)) {
        BackButton.show();
        BackButton.onClick(function() {
            navigate("/payments")
            BackButton.hide();
        });
    } else {
        BackButton.hide();
    }
  }, [window.location.pathname])
  if (paymentType === "sbp") {
    return <SBP />;
  } else if (paymentType === "cards") {
    return <Cards />;
  } else if (paymentType === "ton") {
    return <Ton />;
  } else {
    return (
        <div className="w-[89.74%] mx-auto text-center font-[600] uppercase">ТАКОГО МЕТОДА ОПЛАТЫ НЕТ</div>
    )
  }
  
}

export default Payment;