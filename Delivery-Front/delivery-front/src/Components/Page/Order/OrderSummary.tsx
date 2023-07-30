import React, { useState } from 'react'
import { orderSummaryProps } from './orderSummaryProps'
import { cartItemModel } from '../../../Interfaces'
import { getStatusColor } from '../../../Helper'
import { useNavigate } from 'react-router-dom';
import { SD_Roles, SD_Status } from '../../../Utility/SD';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';
import { useUpdateOrderHeaderMutation } from '../../../apis/orderApi';
import { MainLoader } from '../Common';

function OrderSummary({ data, userInput }: orderSummaryProps) {

  const badgeTypeColor = getStatusColor(data.status!);
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const [loading, setIsLoading] = useState(false);
  const [updateOrderHeader] = useUpdateOrderHeaderMutation();

  const nextStatus: any = data.status! === SD_Status.POTVRDJENA ?
    { color: "info", value: SD_Status.PRIPREMA_SE }
    : data.status! === SD_Status.PRIPREMA_SE ?
    { color: "warning", value: SD_Status.SPREMNA_ZA_ISPORUKU }
    : data.status! === SD_Status.SPREMNA_ZA_ISPORUKU &&
      { color: "success", value: SD_Status.ZAVRSENA };
  
  const handleNextStatus = async () => {
    setIsLoading(true);

    await updateOrderHeader({
      orderHeaderId: data.id,
      status: nextStatus.value,
    });

    setIsLoading(false);
  }

  const handleCancel = async () => {
    setIsLoading(true);

    await updateOrderHeader({
      orderHeaderId: data.id,
      status: SD_Status.OTKAZANA,
    });

    setIsLoading(false);
  }

  return (
    <div>
      {loading && <MainLoader />}
      {!loading && (
        <>
          <div className='d-flex justify-content-between align-items-center'>
        <h3 style={{ color: "#8d3d5b" }}>Rezime porudžbine</h3>
        <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>{data.status}</span>
      </div>
      
      <div className="mt-3">
        <div className="border py-3 px-2">Ime : {userInput.name}</div>
        <div className="border py-3 px-2">Email : {userInput.email}</div>
        <div className="border py-3 px-2">Broj telefona : {userInput.phoneNumber}</div>
            <div className="border py-3 px-2">
            <h4 style={{color:"#8d3d5b"}}>Porudžbine</h4>
            <div className="p-3">
            {data.cartItems?.map((cartItem: cartItemModel, index: number) => {
                return (
                    <div className="d-flex" key={index}>
                    <div className="d-flex w-100 justify-content-between">
                      <p>{cartItem.menuItem?.name}</p>
                      <p>{cartItem.menuItem?.price} RSD x {cartItem.quantity} = </p>
                    </div>
                    <p style={{ width: "70px", textAlign: "right" }}>
                        {(cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0)} RSD
                    </p>
                  </div>  
                )
            })}
          
            
            <hr />
            <h4 className="text-danger" style={{ textAlign: "right" }}>
              {data.cartTotal?.toFixed(2)} RSD
            </h4>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between align-items-center mt-3'>
        <button className='btn btn-secondary' onClick={() => navigate(-1)}>Nazad</button>
        {userData.role == SD_Roles.ADMIN && (
          <div className='d-flex'>
            {data.status! !== SD_Status.OTKAZANA && 
              data.status! !== SD_Status.ZAVRSENA && 
                  <button className='btn btn-danger mx-2' onClick={handleCancel}>Otkaži</button>
            }
            <button className={`btn btn-${nextStatus.color}`} onClick={handleNextStatus}>{nextStatus.value}</button>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}

export default OrderSummary
