import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useGetMenuItemByIdQuery } from '../apis/menuItemApi';
import { useState } from 'react';
import { useUpdateShoppingCartMutation } from '../apis/shoppingCartApi';
import { MainLoader, MiniLoader } from '../Components/Page/Common';
import { apiResponse, userModel } from '../Interfaces';
import { toastNotify } from '../Helper';
import { useSelector } from 'react-redux';
import { RootState } from '../Storage/Redux/store';

function MenuItemDetails() {

  const { menuItemId } = useParams();
  const { data, isLoading } = useGetMenuItemByIdQuery(menuItemId);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  const navigate = useNavigate();
  //console.log(data);

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (newQuantity == 0) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
    return;
  }

  const handleAddToCart = async (menuItemId: number) => {

    if (!userData.id) {
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);

    const response : apiResponse = await updateShoppingCart({
      menuItemId: menuItemId,
      updateQuantityBy: quantity,
      userId: userData.id,
    });

    //console.log(response);

    if (response.data && response.data.isSuccess) {
      toastNotify("Uspešno ste dodali proizvod u korpu!")
    }

    setIsAddingToCart(false);
  }

  return (
    <div className="container pt-4 pt-md-5">
      {!isLoading ? (
      <div className="row">
      <div className="col-7">
        <h2 style={{color:"#8d3d5b"}}>{data.result?.name}</h2>
        <span>
          <span
            className="badge text-bg-dark pt-2"
            style={{ height: "40px", fontSize: "20px" }}
          >
            {data.result?.category}
          </span>
        </span>
        <span>
          <span
            className="badge text-bg-light pt-2"
            style={{ height: "40px", fontSize: "20px" }}
          >
            {data.result?.specialTag}
          </span>
        </span>
        <p style={{ fontSize: "20px" }} className="pt-2">
        {data.result?.description}
        </p>
        <span className="h3">{data.result?.price} RSD</span> &nbsp;&nbsp;&nbsp;
        <span
          className="pb-2  p-3"
          style={{ border: "1px solid #333", borderRadius: "30px" }}
        >
          <i onClick={() => {
            handleQuantity(-1);
          }}
            className="bi bi-dash p-1"
            style={{ fontSize: "25px", cursor: "pointer" }}
          ></i>
            <span className="h3 mt-3 px-3">{quantity}</span>
          <i onClick={() => {
            handleQuantity(+1);
          }}
            className="bi bi-plus p-1"
            style={{ fontSize: "25px", cursor: "pointer" }}
          ></i>
        </span>
        <div className="row pt-4">
          <div className="col-5">
            {isAddingToCart? (
              <button disabled className="btn form-control" 
                style={{backgroundColor:"#8d3d5b", color:"white"}}>
                <MiniLoader />
              </button>): (
              <button className="btn form-control" 
                style={{backgroundColor:"#8d3d5b", color:"white"}}
                onClick={() => handleAddToCart(data.result?.id)}>
                Dodaj u Korpu
              </button>
            )}
            
          </div>

          <div className="col-5 ">
            <NavLink className="nav-link" aria-current="page" to="/menuPage">
              <button className="btn btn-secondary form-control">
                Nazad
                </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="col-5">
        <img
          src={data.result.image}
          width="100%"
          style={{ borderRadius: "50%" }}
          alt="No content"
        ></img>
      </div>
        </div>) :
        (
          <div className = 'd-flex justify-content-center' style={{width: "100%"}}> 
            <MainLoader />
          </div>
        )}
  </div>
  )
}

export default MenuItemDetails
