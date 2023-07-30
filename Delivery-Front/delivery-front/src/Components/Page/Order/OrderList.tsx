import React from 'react'
import { orderHeaderModel } from '../../../Interfaces'
import OrderListProps from './orderListType'
import { MainLoader } from '../Common'
import { useNavigate } from 'react-router-dom'
import { getStatusColor } from '../../../Helper'

function OrderList({ isLoading, orderData }: OrderListProps) {
    
    const navigate = useNavigate();

  return (
      <>
          {isLoading && <MainLoader />}
            {!isLoading && (
                <div className="table px-5">
                    
                    <div className="p-2">
                        <div className="row border">
                            <div className="col-1">ID</div>
                            <div className="col-2">Ime</div>
                            <div className="col-2">Broj telefona</div>
                            <div className="col-1">Ukupno</div>
                            <div className="col-1">Količina</div>
                            <div className="col-2">Datum</div>
                            <div className="col-2">Status</div>
                            <div className="col-1"></div>
                          
                        </div>
                        {orderData.map((orderItem: orderHeaderModel) => {
                            const badgeColor = getStatusColor(orderItem.status!);
                            return (
                                <div className="row border" key={orderItem.orderHeaderId} >
                                    <div className="col-1">{ orderItem.orderHeaderId}</div>
                                    <div className="col-2">{ orderItem.pickupName }</div>
                                    <div className="col-2">{ orderItem.pickupPhoneNumber }</div>
                                    <div className="col-1">{ orderItem.orderTotal!.toFixed(2)}</div>
                                    <div className="col-1">{ orderItem.totalItems}</div>
                                    <div className="col-2">{new Date(orderItem.orderDate!).toLocaleDateString()}</div>
                                    <div className="col-2">
                                        <span className={`badge bg-${badgeColor}`}>
                                            {orderItem.status}
                                        </span>
                                    </div>
                                    <div className="col-1">
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: "#8d3d5b", color: "white" }}
                                            onClick={() => navigate("/order/orderDetails/" + orderItem.orderHeaderId)}>
                                            Detalji
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
            )}
      </>
  )
}

export default OrderList
