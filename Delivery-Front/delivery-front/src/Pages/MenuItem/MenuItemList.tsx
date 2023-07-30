import React from 'react'
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '../../apis/menuItemApi'
import { MainLoader } from '../../Components/Page/Common';
import { menuItemModel } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function MenuItemList() {

    const [deleteMenuItem] = useDeleteMenuItemMutation();
    const { data, isLoading } = useGetMenuItemsQuery(null);
    const navigate = useNavigate();

    const handleMenuItemDelete = async (id: number) => {
        toast.promise(
            deleteMenuItem(id),
            {
              pending: 'Vaš zahtev se obrađuje...',
              success: 'Proizvod obrisan uspešno',
              error: 'Došlo je do greške!'
            }
        )
    };

    return (
        <>
        {isLoading && <MainLoader />}
        {!isLoading && (
            <div className="table p-5">
            <div className="d-flex align-items-center justify-content-between">
            <h1 style={{color:"#8d3d5b"}}>Meni</h1>
            <button 
                className="btn" 
                style={{backgroundColor:"#8d3d5b", color:"white"}}
                onClick={()=> navigate("/menuItem/menuItemUpsert/")}
                >
                    Dodaj novi proizvod
                </button>
            </div>
            <div className="p-2">
            <div className="row border">
                <div className="col-2">Slika</div>
                <div className="col-1">ID</div>
                <div className="col-2">Naziv</div>
                <div className="col-2">Kategorija</div>
                <div className="col-1">Cena</div>
                <div className="col-2">Specijalna oznaka</div>
                <div className="col-1">Akcije</div>
            </div>
            {data.map((menuItem: menuItemModel)=> {
                return (
                    <div className="row border" key={menuItem.id}>
                        <div className="col-2">
                            <img
                                src={menuItem.image}
                                alt="no content"
                                style={{ width: "100%", maxWidth: "120px" }}
                                className='rounded'
                            />
                        </div>
                        <div className="col-1">{menuItem.id}</div>
                        <div className="col-2">{menuItem.name}</div>
                        <div className="col-2">{menuItem.category}</div>
                        <div className="col-1">{menuItem.price}  RSD</div>
                        <div className="col-2">{menuItem.specialTag}</div>
                        <div className="col-1">
                            <button className="btn"
                                style={{ backgroundColor: "#8d3d5b", color: "white" }} >
                                <i className="bi bi-pencil-fill"
                                    onClick={()=> navigate("/menuItem/menuItemUpsert/" + menuItem.id)}></i>
                            </button>
                            <button className="btn btn-danger mx-2">
                                <i className="bi bi-trash-fill"
                                    onClick={()=> handleMenuItemDelete(menuItem.id)}></i>
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

export default MenuItemList
