import React, { useEffect, useState } from 'react';
import { withAdminAuth, withAuth } from '../../../HOC';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import { RootState } from '../../../Storage/Redux/store';
import { useGetAllOrdersQuery } from '../../../apis/orderApi';
import OrderList from './OrderList';
import { MainLoader } from '../Common';
import { inputHelper } from '../../../Helper';
import { SD_Status } from '../../../Utility/SD';
import { orderHeaderModel } from '../../../Interfaces';

const filterOptions = [
  "Sve",
  SD_Status.POTVRDJENA,
  SD_Status.PRIPREMA_SE,
  SD_Status.SPREMNA_ZA_ISPORUKU,
  SD_Status.OTKAZANA,
  SD_Status.ZAVRSENA,
];

function AllOrders() {

  const [filters, setFilters] = useState({ searchString: "", status: "" });
  const [orderData, setOrderData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 5,
  });

  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

  const [apiFilters, setApiFilters] = useState({
    searchString: "",
    status: "",
  });

  const { data, isLoading } = useGetAllOrdersQuery({
    ...(apiFilters && {
      searchString: apiFilters.searchString,
      status: apiFilters.status,
      pageNumber: pageOptions.pageNumber,
      pageSize: pageOptions.pageSize,
    }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);
  };

  const handleFiters = () => {
    setApiFilters({
      searchString: filters.searchString,
      status: filters.status});
  };

    //console.log(data);
  
  useEffect(() => {
    if (data) {
      setOrderData(data.apiResponse.result);
      const { TotalRecords } = JSON.parse(data.totalRecords);
      setTotalRecords(TotalRecords);
    }
  }, [data])

  const getPageDetails = () => {
    const dataStartNumber = (pageOptions.pageNumber - 1) * pageOptions.pageSize + 1;
    const dataEndNumber = pageOptions.pageNumber * pageOptions.pageSize;

    return `${dataStartNumber} 
    - ${dataEndNumber < totalRecords ? dataEndNumber : totalRecords} od ${totalRecords}`;
  };

  const handlePageOptionChange = (direction: string, pageSize?: number) => {
    if (direction === "prev") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1 });
    } else if (direction === "next") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1 });
    } else if (direction === "change") {
      setPageOptions({
        pageSize: pageSize ? pageSize : 5,
        pageNumber: 1,
      });
    }
  }

    return (
      <>
        {isLoading && <MainLoader />}
        {!isLoading && (
          <>
            <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
              <h1 style={{ color: "#8d3d5b" }}>Istorija porudžbina</h1>
              <div className='d-flex' style={{width:"40%"}}>
                <input
                  type='text'
                  className='form-control mx-2'
                  placeholder='Pretraži'
                  name='searchString'
                  onChange={handleChange}/>
                <select
                  className='form-select w-50 mx-2'
                  onChange={handleChange}
                  name='status'
                >
                  {filterOptions.map((item, index) => (
                    <option key={index} value={item === "Sve" ? "" : item}>{item}</option>
                  ))}
                </select>
                <button
                  className='btn btn-outline' 
                  style={{ backgroundColor: "#8d3d5b", color: "white" }}
                  onClick={handleFiters}
                >
                  Filtriraj
                </button>
              </div>
            </div>
            <OrderList isLoading={isLoading} orderData={orderData} />
            <div className='d-flex mx-5 justify-content-end align-items-center'>
              <div>Proizvodi po stranici: </div>
              <div>
                <select className='form-select mx-2'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handlePageOptionChange("change", Number(e.target.value));
                    setCurrentPageSize(Number(e.target.value));
                  }}
                  style={{ width: "80px" }}
                  value={currentPageSize}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
            <div className='mx-2'>
              {getPageDetails()}
              </div>
              <button
                onClick={() => handlePageOptionChange("prev")}
                disabled={pageOptions.pageNumber === 1}
                className='btn btn-outline-secondary px-3 mx-2'>
                <i className='bi bi-chevron-left'></i>
              </button>
              <button
                onClick={() => handlePageOptionChange("next")}
                disabled={pageOptions.pageNumber * pageOptions.pageSize >= totalRecords}
                className='btn btn-outline-secondary px-3 mx-2'>
                <i className='bi bi-chevron-right'></i>
              </button>
            </div>
          </>
        )}
      </>
  )
}

export default withAdminAuth(AllOrders)
