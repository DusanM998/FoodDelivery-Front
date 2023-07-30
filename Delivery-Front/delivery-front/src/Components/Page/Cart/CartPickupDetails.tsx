import React, {useEffect, useState} from 'react'
import { apiResponse, cartItemModel } from '../../../Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';
import { inputHelper } from '../../../Helper';
import { MiniLoader } from '../Common';
import { useInitiatePaymentMutation } from '../../../apis/paymentApi';
import { useNavigate } from 'react-router-dom';

function CartPickupDetails() {
    const [loading, setLoading] = useState(false);

    const shoppingCartFromStore : cartItemModel[] = useSelector(
        (state : RootState) => state.shoppingCartStore.cartItems ?? []
    );
    
  const userData = useSelector((state: RootState) => state.userAuthStore);
    
    let grandTotal = 0;
    let totalItems = 0;
    const initialUserData = {
        name: userData.fullName,
        email: userData.email,
        phoneNumber: "",
    };

    shoppingCartFromStore?.map((cartItem: cartItemModel) => {
        totalItems += cartItem.quantity ?? 0;
        grandTotal += (cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0);
        return null;
    })
  
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState(initialUserData);

    const [initiatePayment] = useInitiatePaymentMutation();
  
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

      const { data }: apiResponse = await initiatePayment(userData.id);
      const orderSummary = { grandTotal, totalItems };

      //console.log(data);

      navigate("/payment", {
        state: {apiResult: data?.result, userInput},
      });
    };

  return (
    <div className="border rounded pb-5 pt-3">
    <h1 style={{ fontWeight: "300", color:"#8d3d5b" }} className="text-center" >
      Podaci o korisniku
    </h1>
    <hr />
    <form onSubmit={handleSubmit} className="col-10 mx-auto">
      <div className="form-group mt-3">
        Ime
        <input
          type="text"
          value = {userInput.name}
          className="form-control"
          placeholder="Ime..."
          name="name"
          required
          onChange={handleUserInput}
        />
      </div>
      <div className="form-group mt-3">
        Email
        <input
          type="email"
          value = {userInput.email}
          className="form-control"
          placeholder="Email..."
          name="email"
          required
          onChange={handleUserInput}
        />
      </div>

      <div className="form-group mt-3">
        Broj Telefona
        <input
          type="number"
          value = {userInput.phoneNumber}
          className="form-control"
          placeholder="Broj Telefona..."
          name="phoneNumber"
          required
          onChange={handleUserInput}
        />
      </div>
      <div className="form-group mt-3">
        <div className="card p-3" style={{ background: "ghostwhite" }}>
          <h5>Ukupno za plaćanje : {grandTotal.toFixed(2)} RSD</h5>
          <h5>Količina : {totalItems}</h5>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-lg form-control mt-3"
        style={{backgroundColor:"#8d3d5b", color: "white"}}
        disabled = {loading}
      >
        {loading ? <MiniLoader /> : "Nastavi na plaćanje"}
      </button>
    </form>
  </div>
  )
}

export default CartPickupDetails
