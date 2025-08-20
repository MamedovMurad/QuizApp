import api from "./agent"

const getPricings = () => {
  return api.get("/package")
}
const createPricing = (values: any) => {
  return api.post("/admin/package", values);
};
const updatePricing = (values: any, id: number | string) => {
  return api.put("/admin/package/" + id, values);
};
const deletePricing = (id: string | number) => {
  return api.delete("/admin/package/" + id);
};

const makePayment = (id:string|number)=>{
  return api.post("/make-payment", {package_id:id});
}


const getPromos = ()=>{
   return api.get("/admin/promo-code");
}
const createPromo = (values:{title:string; discount:number|string})=>{
   return api.post("/admin/promo-code",values);
}
export {
    getPricings,
    createPricing,
    updatePricing,
    deletePricing,
    makePayment,
    getPromos,
    createPromo
}