import React, { useEffect, useState } from 'react'
import { useCreateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from '../../apis/menuItemApi';
import { useNavigate, useParams } from 'react-router-dom';
import { inputHelper, toastNotify } from '../../Helper';
import { MainLoader } from '../../Components/Page/Common';
import { SD_Categories } from '../../Utility/SD';

const Categories = [
  SD_Categories.Americka,
  SD_Categories.BrzaHrana,
  SD_Categories.Dezert,
  SD_Categories.Dorucak,
  SD_Categories.Azijska,
  SD_Categories.Grickalice,
  SD_Categories.Italijanska,
  SD_Categories.Meso,
  SD_Categories.Peciva,
  SD_Categories.Pice,
  SD_Categories.Zdravo,
  SD_Categories.Slatkisi,
  SD_Categories.Salate,
  SD_Categories.Predjelo,
];

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};

function MenuItemUpsert() {

    const [imageToBeStore, setImageToBeStore] = useState<any>();
    const [imageToBeDisplay, setImageToBeDisplay] = useState<string>();
    const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
    const [loading, setLoading] = useState(false);
    const [createMenuItem] = useCreateMenuItemMutation();
    const [updateMenuItem] = useUpdateMenuItemMutation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useGetMenuItemByIdQuery(id);
    
    useEffect(() => {
      if (data && data.result) {
        const tempData = {
          name: data.result.name,
          description: data.result.description,
          specialTag: data.result.specialTag,
          category: data.result.category,
          price: data.result.price,
        };
        setMenuItemInputs(tempData);
        setImageToBeDisplay(data.result.image);
      }
    }, [data]);

    const handleMenuItemInput = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const tempData = inputHelper(e, menuItemInputs);
      setMenuItemInputs(tempData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            //console.log(file);
            const imgType = file.type.split("/")[1];
            const validImgTypes = ["jpeg", "jpg", "png"];

            const isImgTypeValid = validImgTypes.filter((e) => {
                return e === imgType;
            });

            if (file.size > 5000 * 1024) {
                setImageToBeStore("");
                toastNotify("Veličina fajla mora biti manja od 5MB!", "error");
                return;
            }
            else if (isImgTypeValid.length === 0) {
                setImageToBeStore("");
                toastNotify("Fajl mora biti u jpeg, jpg ili png formatu!", "error");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            setImageToBeStore(file);
            reader.onload = (e) => {
                const imgUrl = e.target?.result as string;
                setImageToBeDisplay(imgUrl);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setLoading(true);

        if (!imageToBeStore && !id) {
            toastNotify("Molimo Vas dodajte sliku!", "error");
            setLoading(false);
            return;
        }

        const formData = new FormData();

        formData.append("Name", menuItemInputs.name ?? "");
        formData.append("Description", menuItemInputs.description ?? "");
        formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
        formData.append("Category", menuItemInputs.category);
        formData.append("Price", menuItemInputs.price ?? "");
        if(imageToBeDisplay) formData.append("File", imageToBeStore);

        let response;

        if (id) {
          //update
          formData.append("Id", id);
          response = await updateMenuItem({ data: formData, id });
          toastNotify("Proizvod je uspešno ažuriran!", "success");
        } else {
          //create
          response = await createMenuItem(formData);
          toastNotify("Proizvod je uspešno kreiran!", "success");
        }
        
        if (response) {
            setLoading(false);
            navigate("/menuItem/menuItemList");
        }

        setLoading(false);
    }

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
    <h3 className="px-2" style={{color:"#8d3d5b"}}>
      {id ? "Ažuriraj proizvod" : "Dodaj novi proizvod"}
    </h3>
    <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="row mt-3">
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Unesite Naziv"
            required
            name='name'
            value={menuItemInputs.name}
            onChange={handleMenuItemInput}
          />
          <textarea
            className="form-control mt-3"
            placeholder="Unesite Opis"
            name='description'
            rows={10}
            value={menuItemInputs.description}
            onChange={handleMenuItemInput}
          ></textarea>
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Unesite Specijalnu Oznaku"
            name='specialTag'
            value={menuItemInputs.specialTag}
            onChange={handleMenuItemInput}
          />
          <select
            className="form-control mt-3 form-select"
            placeholder="Unesite Kategoriju"
            name="category"
            value={menuItemInputs.category}
            onChange={handleMenuItemInput}
          >
            {Categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            className="form-control mt-3"
            required
            placeholder="Unesite Cenu"
            name='price'
            value={menuItemInputs.price}
            onChange={handleMenuItemInput}
          />
          <input 
            type="file" 
            className="form-control mt-3" 
            onChange={handleFileChange}/>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  style={{backgroundColor: "#8d3d5b", color: "white" }}
                  className="btn mt-5 form-control"
                >
                  {id ? "Ažuriraj" : "Kreiraj"}
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-secondary mt-5 form-control"
                  onClick={()=> navigate("/menuItem/menuItemList")}
                >
                  Nazad
                </button>
              </div>
            </div>
        </div>
        <div className="col-md-5 text-center">
          <img
            src={imageToBeDisplay}
            style={{ width: "100%", borderRadius: "30px" }}
            alt=""
          />
        </div>
      </div>
    </form>
  </div>
  )
}

export default MenuItemUpsert
