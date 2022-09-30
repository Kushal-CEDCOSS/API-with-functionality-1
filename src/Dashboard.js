import React, { useEffect, useMemo, useState } from "react";
import DashboardStyles from "./Dashboard.module.css";
import {
  Spinner,
  Card,
  DataTable,
  Frame,
  Navigation,
  Page,
  Pagination,
  Select,
  SkeletonTabs,
  TextField,
} from "@shopify/polaris";
import { SkeletonPage } from "@shopify/polaris";
import { ProductsMajor, InventoryMajor } from "@shopify/polaris-icons";

const Dashboard = () => {
  const [newToken, setNewToken] = useState("");
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [count, setCount] = useState(10);
  const [selected, setSelected] = useState("Row per page");
  const [tableData, setTableData] = useState([]);
  const [filterArray, setFilterArray] = useState(Array(8).fill("1"));
  const [criteriaArray, setCriteriaArray] = useState(Array(8).fill(""));
  const [placeholderArray, setPlaceholderArray] = useState([
    "user_id",
    "catalog",
    "username",
    "email",
    "shopify_plan",
    "updated_at",
    "created_at",
    "shop_url",
  ])
  const selectOptions = [
    { label: "Row per page 10", value: "10" },
    { label: "Row per page 20", value: "20" },
    { label: "Row per page 30", value: "30" },
  ];

  const selectOptions2 = [
    { label: "Equals", value: "1" },
    { label: "Not Equals", value: "2" },
    { label: "Contains", value: "3" },
    { label: "Does Not Contains", value: "4" },
    { label: "Starts With", value: "5" },
    { label: "Ends With", value: "6" },
  ];

  const headings = [
    "user_id",
    "catalog",
    "username",
    "shops.email",
    "shopify_plan",
    "updated_at",
    "created_at",
    "shop_url",
  ]

  const handleSelectChange = (e) => {
    setSelected(e);
    setCount(Number(e));
  };

  const filterSelects = useMemo(() => {
    var temp = [];
    Array(8)
      .fill(0)
      .map((item, index) => {
        var intermediateSelect = <>
          <Select
            options={selectOptions2}
            onChange={(data) => {
              filterArray[index] = data;
              setFilterArray([...filterArray]);
            }}
            value={filterArray[index]}
          />
          <TextField
            onChange={(text) => {
              criteriaArray[index] = text;
              setCriteriaArray([...criteriaArray]);
            }}

            value={criteriaArray[index]}
            placeholder={placeholderArray[index]}
          />
        </>
        temp.push(intermediateSelect);
      });
    return temp;
  });

  useEffect(() => {
    var token = sessionStorage.getItem("User");
    setNewToken(token);
  }, []);


  useEffect(() => {
    if (newToken === "") {
      return;
    }
    setData([]);
    var options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: newToken,
      },
    };
    fetch(
      `https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${count}`,
      options
    )
      .then((res) => res.json())
      .then((result) => setData(result));
  }, [newToken, activePage, count]);

  useEffect(() => {
    if (data.length === 0) {return;}
    var intermediate = [];
    data.data.rows.map((item) => {
      var temp = [];
      temp.push(item.user_id);
      temp.push(item.catalog);
      temp.push(item.username);
      temp.push(item.email);
      temp.push(item.shopify_plan);
      temp.push(item.updated_at);
      temp.push(item.created_at);
      temp.push(item.shop_url);
      intermediate.push(temp);
    });
    setTableData(intermediate);
  }, [data]);

  useEffect(()=> {
    var count = 0;
    criteriaArray.map(item => item === "" ? count+=1 : null)
    if(count === 8)
    {
      return;
    }
    else
    {
      setTimeout(()=>{
        var tempString = "";
        criteriaArray.map((item, index) => item === "" ? null : tempString+= `&filter[${headings[index]}][${filterArray[index]}]=${item}`)
        console.log(`https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${count}${tempString}`);
        var options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: newToken,
          },
        };
        fetch(
          `https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${activePage}&count=${count}${tempString}`,
          options
        )
          .then((res) => res.json())
          .then((result) => setData(result));
        console.log(tempString);
      }, 1500)
    }
  },[criteriaArray])
  return (
    <div className={DashboardStyles.Dashboard}>
      <div className={DashboardStyles.Navbar}>Dashboard</div>
      <div className={DashboardStyles.ContentArea}>
        <div className={DashboardStyles.Sidebar}>
          <Frame>
            <Navigation location="/">
              <Navigation.Section
                items={[
                  {
                    url: "/dashboard",
                    label: "Dashboard",
                    icon: InventoryMajor,
                  },
                  {
                    url: "/dashboard",
                    label: "Products",
                    icon: ProductsMajor,
                  },
                  {
                    url: "/dashboard",
                    label: "Grid",
                    icon: ProductsMajor,
                  },
                ]}
              />
            </Navigation>
          </Frame>
        </div>
        <div className={DashboardStyles.ContentBar}>
          {data.length === 0 ? (
            <Spinner size="small" />
          ) : (
            <>
              <h2>Data Grid...</h2>
              <h1>
                Showing from {(activePage - 1) * count + 1} to{" "}
                {activePage * count} of {data.data.count} users
              </h1>
            </>
          )}

          <div className={DashboardStyles.Row}>
            {data.length === 0 ? (
              <Pagination
                label={activePage}
                hasPrevious
                onPrevious={() => {
                  return;
                }}
                hasNext
                onNext={() => {
                  return;
                }}
              />
            ) : (
              <Pagination
                label={activePage}
                hasPrevious
                onPrevious={() => {
                  activePage !== 1 && setActivePage(activePage - 1);
                }}
                hasNext
                onNext={() => {
                  activePage * count !== data.data.count &&
                    setActivePage(activePage + 1);
                }}
              />
            )}

            <Select
              options={selectOptions}
              onChange={handleSelectChange}
              value={selected}
            />
            <button>View Columns</button>
          </div>
          {data.length === 0 ? (
            <SkeletonPage>
              <Card sectioned>
                {Array(count)
                  .fill(0)
                  .map((item) => (
                    <SkeletonTabs count={7} />
                  ))}
              </Card>
            </SkeletonPage>
          ) : (
            <div className={DashboardStyles.TableArea}>
              <Page>
                <Card>
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "numeric",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                    ]}
                    headings={[
                      "UserId",
                      "Catalog",
                      "Shop Domain",
                      "Shop Email",
                      "Shop Plan name",
                      "Updated at",
                      "Created at",
                      "Shops myshopify domain"
                    ]}
                    rows={[filterSelects,...tableData]}
                  />
                </Card>
              </Page>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
