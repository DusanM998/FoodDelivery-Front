import React, { useEffect, useState } from 'react';
import { menuItemModel } from '../../../Interfaces';
import { useGetMenuItemsQuery } from '../../../apis/menuItemApi';
import MenuItemCard from './MenuItemCard';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuItem } from '../../../Storage/Redux/menuItemSlice';
import { MainLoader } from '../Common';
import { RootState } from '../../../Storage/Redux/store';
import { SD_SortTypes } from '../../../Utility/SD';

function MenuItemList() {

  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const [selectedCategory, setSelectCategory] = useState("Sve");
  const [categoryList, setCategoryList] = useState([""]);
  const [sortName, setSortName] = useState(SD_SortTypes.Naziv_A_Z);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMenuItemsQuery(null);

  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.Cena_Opadajuce,
    SD_SortTypes.Cena_Rastuce,
    SD_SortTypes.Naziv_A_Z,
    SD_SortTypes.Naziv_Z_A,
  ]

  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  useEffect(() => {
    if (data) {
      const tempMenuArray = handleFilters(sortName,selectedCategory, searchValue);
      setMenuItems(tempMenuArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data));
      setMenuItems(data);

      const tempCategoryList = ["Sve"];
      data.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });

      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "Sve";
        }
        else {
          localCategory = categoryList[index];
        }
        setSelectCategory(localCategory);
        const tempArray = handleFilters(sortName,localCategory,searchValue);
        setMenuItems(tempArray);
      }
      else {
        button.classList.remove("active");
      }
    })
  };

  const handleFilters = (sortType: SD_SortTypes, category: string, search: string) => {
    //let tempMenuItems = [...data];
    let tempArray = category === "Sve" ? [...data] : data.filter((item: menuItemModel) => (
      item.category.toUpperCase() === category.toUpperCase()
    ));
    
    //Funkcionalnost za pretrazivanje proizvoda
    if (search) {
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item: menuItemModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    //Funkcionalnost za sortiranje proizvoda
    if (sortType === SD_SortTypes.Cena_Rastuce) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => a.price - b.price);
    }
    if (sortType === SD_SortTypes.Cena_Opadajuce) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => b.price - a.price);
    }
    if (sortType === SD_SortTypes.Naziv_A_Z) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) =>
        a.name.toUpperCase().charCodeAt(0) -
        b.name.toUpperCase().charCodeAt(0));
    }
    if (sortType === SD_SortTypes.Naziv_Z_A) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) =>
        b.name.toUpperCase().charCodeAt(0) -
        a.name.toUpperCase().charCodeAt(0));
    }

    return tempArray;
  };

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategory,
      searchValue,
    );
    setMenuItems(tempArray);
  };

  if (isLoading) {
    return <MainLoader />
  }

  return (
    <div className='container row'>
      <div className="my-3">
        <ul className='nav w-100 d-flex justify-content-center'>
          {categoryList.map((categoryName, index) => (
            <li className='nav-item'
            style={{...(index === 0 && {marginLeft:"auto"})}}  key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
                onClick={() => handleCategoryClick(index)}>
                  {categoryName}
              </button>
            </li>
          ))}
          <li className='nav-item dropdown' style={{ marginLeft: "auto" }}>
            <div
              className='nav-link dropdown-toggle text-dark fs-6 border'
              role='button'
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
            {sortName}  
            </div>
            <ul className='dropdown-menu'>
              {sortOptions.map((sortType, index) => (
                <li key={index} className='dropdown-item'
                  onClick={()=> handleSortClick(index)}>
                  {sortType}
                </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
      {menuItems.length > 0 &&
        menuItems.map((menuItem: menuItemModel, index: number) => (
          <MenuItemCard menuItem={menuItem} key={index}/> 
      ))}
    </div>
  )
}

export default MenuItemList
