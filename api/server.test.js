const request  = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

beforeAll(async()=>{
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async ()=>{
  await db.destroy();
});

// testleri buraya yazın
test('[0] Testler çalışır durumda]', () => {
  expect(true).toBe(true)
})

describe("Auth Test", ()=>{
  it("[1] Register başarılı mı?", async()=>{
    //arrange
    const sample = {"username":"bob","password":"1234"};
    //act
    const result = await request(server).post("/api/auth/register").send(sample);
    //assert
    expect(result.status).toBe(201);
    expect(result.body.id).toBeGreaterThan(0);
  })
  it("[2] username boş olunca hata veriyor mu ?", async()=>{
    //arrange
    const sampleModel = { "password":"1234" };
    //act
    const result = await request(server).post("/api/auth/register").send(sampleModel);
    //assert
    expect(result.status).toBe(400);
    expect(result.body.message).toEqual("username ve password gereklidir");
  });
  it("[3] username kontrolü yapılıyor mu?", async()=> {
    const sample={"username": "rum", "password":"1234"}
    const res = await request(server).post("/api/auth/register").send(sample);
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual("username alınmış");
  })
  it("[4] login sonucnda token üretiliyor mu?", async()=>{
    const sample={"username": "rum", "password":"1234"}
    const res = await request(server).post("/api/auth/login").send(sample)
    expect(res.body.token.length).toBeGreaterThan(3);
  });
  it("[5] tokensız bilmeceler açılıyor mu?", async()=>{
    const res = await request(server).get("/api/bilmeceler");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("token gereklidir");
  })
  it("[6] bilmeceler token ile açılıyor mu?", async()=>{
    const sample={"username": "rum", "password":"1234"}
    const loginResult = await request(server).post("/api/auth/login").send(sample);
    const res = await request(server).get("/api/bilmeceler").set("authorization", loginResult.body.token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3)
  })
})

