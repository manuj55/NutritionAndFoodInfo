import React from "react";
import { Form } from "antd";
import { Input, Button, Tabs, Descriptions, message } from "antd";
const { TabPane } = Tabs;
const Layout = () => {
  const [nutrition, setNutrition] = React.useState();
  const [food, setFood] = React.useState();
  const [data, setData] = React.useState();
  const [searchByName, setSearchByName] = React.useState(true);
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const YOUR_APP_ID = "c0717e14";
  const YOUR_APP_KEY = "a68b338d935a5f20e6551203c39fb28c";
  async function FetchNutrition(searchString) {
    const responseData = await fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&ingr=${encodeURIComponent(
        searchString
      )}`
    );
    const data = await responseData.json();
    setNutrition(data);
    // console.log(data);
  }
  async function AddNutrition() {
    const responseData = await fetch(
      `https://api.edamam.com/api/nutrition-details?app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          message.error(json.error);
        } else {
          setNutrition(json);
        }
      })
      .catch((err) => message.error(err));
    // const data = await responseData.json();
    // setNutrition(data);
    // console.log(data);
  }
  async function FetchFood(searchString) {
    const responseData = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(
        searchString
      )}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`
    );
    const data = await responseData.json();
    // setNutrition(data);
    setFood(data.parsed[0].food);
    // console.log(data);
  }
  const onFinish = (values) => {
    // console.log("Success:", values);
    setNutrition();
    setData({ title: values.title, prep: values.prep, ingr: [values.ingr] });
  };
  React.useEffect(() => {
    if (data) {
      AddNutrition();
    }
  }, [data]);
  //   const onFinishFailed = (errorInfo) => {
  //     console.log("Failed:", errorInfo);
  //   };
  const onSearch = (value) => {
    FetchNutrition(value);
  };
  const onSearchFood = (value) => {
    FetchFood(value);
  };
  const getDescription = () => {
    return (
      nutrition && (
        <div>
          <Descriptions title="Nutrition Info" bordered>
            <Descriptions.Item label="Calories">
              {nutrition.calories}
            </Descriptions.Item>
            <Descriptions.Item label="Cautions">
              {nutrition.cautions[0]}
            </Descriptions.Item>
            <Descriptions.Item label="Diet Labels">
              {nutrition.dietLabels[0]}
            </Descriptions.Item>
            <Descriptions.Item label="Health Labels">
              {nutrition.healthLabels.map((item) => {
                return item + " " + ",";
              })}
            </Descriptions.Item>
            <Descriptions.Item label="totalWeight">
              {nutrition.totalWeight}
            </Descriptions.Item>
            {Object.keys(nutrition.totalNutrientsKCal).map((item) => {
              return (
                <Descriptions.Item
                  label={nutrition.totalNutrientsKCal[item].label}
                >
                  {nutrition.totalNutrientsKCal[item].quantity}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </div>
      )
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {/* <Button onClick={() => AddNutrition()}>Add Data</Button> */}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Food Data Base" key="1">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                setSearchByName(false);

                setNutrition();
              }}
            >
              {" "}
              Check Nutrition Data By adding ingredient and Preparation steps
            </Button>
            <Button
              onClick={() => {
                setSearchByName(true);
                setNutrition();
              }}
            >
              Search Nutrition{" "}
            </Button>
          </div>
          {!searchByName ? (
            <>
              <Form
                style={{ width: "80%" }}
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Preparation"
                  name="prep"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Ingredient "
                  name="ingr"
                  rules={[
                    {
                      required: true,
                      message: "Please input ingredient!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
              {getDescription()}
            </>
          ) : (
            <div style={{ padding: "20px" }}>
              <Input.Search
                placeholder="input search text"
                onSearch={onSearch}
                style={{ width: 200, marginBottom: "20px" }}
              />
              {getDescription()}
            </div>
          )}
        </TabPane>
        <TabPane tab="Nutrition Data Base" key="2">
          <div style={{ padding: "20px" }}>
            <Input.Search
              placeholder="input ingredient "
              onSearch={onSearchFood}
              style={{ width: 200, marginBottom: "20px" }}
            />
            {/* {getDescription()} */}
            {food && (
              <div>
                <img src={food.image} alt="Image" width="200" height="200" />
                <Descriptions title="Food Detail" bordered>
                  <Descriptions.Item label="label">
                    {food.label}
                  </Descriptions.Item>
                  <Descriptions.Item label="Category">
                    {food.category}
                  </Descriptions.Item>
                  <Descriptions.Item label="Category Label">
                    {food.categoryLabel}
                  </Descriptions.Item>
                  <Descriptions.Item label="Food Id">
                    {food.foodId}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Layout;
