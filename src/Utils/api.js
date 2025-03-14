import { create } from 'apisauce';
import { API_ENDPOINT } from '../configs';
import { Platform } from 'react-native';
import { subscribe } from 'diagnostics_channel';
import { link } from 'fs';


export const Api = create({
    baseURL: '',
});

export const setLangHeader = (lang) => {
    Api.setHeader('Accept-Language', lang);
}

export const setBearerAuth = (token) => {
    Api.setHeader('Authorization', `Bearer ${token}`);
}

export const getIntroSlider = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/appIntro`);
        console.log("response INTRO data :::: ", response.data.data[0].file);
        // console.log("RESPONSE SLIDER:::: ", response);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getCompanyData = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/companies?removeLanguage=true`);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const setNotifToken = async (fcmToken) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/addToken`, { token: fcmToken, type: Platform.OS === 'ios' ? 'ios' : 'android' });
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export const loginApi = async (data) => {
    try {
        console.log("Data Log IN", data);
        let response = await Api.post(`${API_ENDPOINT}/signin`, data);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const SignUpApi = async (data) => {
    try {
        console.log("Data Register ", data);
        let response = await Api.post(`${API_ENDPOINT}/signup`, data);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const SellOrderApi = async (data) => {
    try {
        console.log("Sell order data ", data);
        let response = await Api.post(`${API_ENDPOINT}/sellOrder`, data);
        console.log()
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}


export const getHomeSlider = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/advertisments`); //images?type=HOME_SLIDER
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getCategory = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/category?all=true`);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getBrands = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/brand?all=true`);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getProducts = async (userId, params) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/product?userId=${userId}`, params);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getTopProducts = async (userId, params, login) => {
    try {
        let link = 'topSelling=true';
        if (userId) {
            link = link + `&userId=${userId}`;
        }
        let response = await Api.get(`${API_ENDPOINT}/product?${link}`, params);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}


export const getLastProducts = async (userId, params, login) => {
    try {
        let link = 'lastProducts=true';
        if (userId) {
            link = link + `&userId=${userId}`;
        }
        let response = await Api.get(`${API_ENDPOINT}/product?${link}`, params);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getLatestProducts = async (userId, SortID, last, brandID, min, max) => {
    console.log("SSSSSSSSSSSSSSSSss", userId, SortID, last, brandID, min, max)
    try {
        let link = 'lastProducts=true';
        if (userId) {
            link = link + `&userId=${userId}`;
        }
        if (last) {
            link = link + `&lastProducts=true`
        }
        else if (SortID) {
            link = link + `&sortByPrice=${SortID}`
        }
        if (brandID) {
            link = link + `&brand=${brandID}`
        }
        if (min) {
            link = link + `&fromPrice=${min}`
        }
        if (max) {
            link = link + `&toPrice=${max}`
        }
        let response;
        console.log("LIIIIIIIIIIIIINK22", `${API_ENDPOINT}/product?${link}`);
        response = await Api.get(`${API_ENDPOINT}/product?${link}`);

        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}


export const getRelatedProducts = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/product?similar=${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getAddress = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/address?user=${id}`);
        console.log("ader api ", response.data.data)
        if (response.ok) {
            return response.data.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getTopSellingProducts = async (SortID, last, brandID, min, max) => {
    console.log("SSSSSSSSSSSSSSSSss", SortID, last, brandID, min, max)
    let link = "";
    if (last) {
        link = link + `&lastProducts=true`
    }
    else if (SortID) {
        link = link + `&sortByPrice=${SortID}`
    }
    if (brandID) {
        link = link + `&brand=${brandID}`
    }
    if (min) {
        link = link + `&fromPrice=${min}`
    }
    if (max) {
        link = link + `&toPrice=${max}`
    }
    console.log("LIIIIIIIIIIIIINK22", `${API_ENDPOINT}/product?topSelling=true?${link}`);
    try {
        let response = await Api.get(`${API_ENDPOINT}/product?topSelling=true${link}`,);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getFavProducts = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/favorites?user=${id}`,);
        console.log("favvvvvvvvvvvvv", response)
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getTermsApi = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/rules`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        return error;
    }
}

export const getCommonQApi = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/reasone?removeLanguage=true`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const likeDislikeApi = async (id, choice) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/reasone/${choice === 'happy' ? 'like' : 'dislike'}/${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const changePasswordApi = async (values) => {
    try {
        let response = await Api.put(`${API_ENDPOINT}/user/changepassword`, values);
        console.log("user passwordddddddddddddddd", response)
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const changeProfile = async (values) => {
    try {
        let response = await Api.put(`${API_ENDPOINT}/user/updateInfo`, values);
        console.log("user updateInfo", response)
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const contactUsApi = async (values) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/contactUs`, values);
        console.log("CONTACT US ::: ", response);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const CreatAdress = async (values) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/address`, values);
        console.log("CreatAdress ::: ", response);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updateAdress = async (values, id) => {
    try {
        console.log("idAddd", id)
        let response = await Api.put(`${API_ENDPOINT}/address/${id}`, values);
        console.log("updateAdress ::: ", response);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getCountry = async () => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/country`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        return error;
    }
}


export const getCities = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/city?country=${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        return error;
    }
}

export const getRegion = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/region?city=${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        return error;
    }
}


export const getProductApi = async (id, userId, login) => {
    try {
        let link = userId ? `?userId=${userId}` : '';
        let response = await Api.get(`${API_ENDPOINT}/product/${id}${link}`);
        console.log("response.dataresponse.data", response.data)
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const chechkProductApi = async (values) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/product/available`, values);
        console.log("chechkProductApi ::: ", response);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getSectionApi = async (id, SubCartID, SortID, last, brandID, min, max) => {
    try {
        console.log("SSSSSSSSSSSSSSSSss", id, SubCartID, SortID, last, brandID, min, max)

        let link;
        // let link = last ? `&lastProducts=true` : SortID ? `&sortByPrice=${SortID}` : + brandID ? `&brand=${brandID}` : + min ? `&fromPrice=${min}` : + max ? `&toPrice=${max}` : + SubCartID ? `&subCategory=${SubCartID}` : '';
        // if(subCategory==-1||!subCategory){
        //     link = link +`category=${id}`
        // }
        // else {
        //     link = link + `&subCategory=${SubCartID}`
        // }
        if (SubCartID) {
            link = `subCategory=${SubCartID}`
        }
        else {
            link = `category=${id}`
        } if (last) {
            link = link + `&lastProducts=true`
        }
        else if (SortID) {
            link = link + `&sortByPrice=${SortID}`
        }
        if (brandID) {
            link = link + `&brand=${brandID}`
        }
        if (min) {
            link = link + `&fromPrice=${min}`
        }
        if (max) {
            link = link + `&toPrice=${max}`
        }
        console.log("LIIIIIIIIIIIIINK22", `${API_ENDPOINT}/product?${link}`);
        let response = await Api.get(`${API_ENDPOINT}/product?${link}`);

        // let response;
        // if (SortID == null) {//
        //     response = await Api.get(`${API_ENDPOINT}/product?category=${id}&subCategory=${SubCartID}&lastProducts=${last}`);
        // }
        // else if (last == null) {
        //     response = await Api.get(`${API_ENDPOINT}/product?category=${id}&subCategory=${SubCartID}&sortByPrice=${SortID}`);

        // }
        // else {
        //     response = await Api.get(`${API_ENDPOINT}/product?category=${id}&subCategory=${SubCartID}`);
        // }

        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getProductsByBrandID = async (id, SubCartID, SortID, last, min, max) => {
    try {
        // let link  = ShowLast?`&lastProducts=true`:sortId?`&sortByPrice=${sortId}`:''+ minPrice?`&fromPrice=${minPrice}`:''+ maxPrice ?`&toPrice=${maxPrice}`:''+ subCategory?`&subCategory=${subCategory}`:'';
        console.log("SSSSSSSSSSSSSSSSss", id, SubCartID, SortID, last, min, max)
        let link = `brand=${id}`
        if (SubCartID) {
            link = link + `&subCategory=${SubCartID}`
        }
        if (last) {
            link = link + `&lastProducts=true`
        }
        else if (SortID) {
            link = link + `&sortByPrice=${SortID}`
        }
        if (min) {
            link = link + `&fromPrice=${min}`
        }
        if (max) {
            link = link + `&toPrice=${max}`
        }
        console.log("LIIIIIIIIIIIIINK22", `${API_ENDPOINT}/product?${link}`);
        let response = await Api.get(`${API_ENDPOINT}/product?${link}`);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getSubCategories = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/sub-category?parent=${id}`);

        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}


export const getTransactionApi = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/walletTransaction?user=${id}`);

        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}
export const getAllSubCategories = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/sub-category`);

        return response;
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getOrderApi = async (userId, page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/order?user=${userId}&type=NORMAL`, { page: page, limit: 20 });
        if (response.ok) {
            return { data: response.data, pageCount: response.data.pageCount };
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}


export const getOrderStorageApi = async (userId, page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/order?user=${userId}&type=STORAGE`, { page: page, limit: 20 });
        if (response.ok) {
            return { data: response.data, pageCount: response.data.pageCount };
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}


export const deleteOrder = async (id) => {
    try {
        let response = await Api.delete(`${API_ENDPOINT}/order/${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}
export const getOrderDetailsApi = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/order/${id}`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}



export const cancelOrderApi = async (id) => {
    try {
        let response = await Api.put(`${API_ENDPOINT}/order/${id}/canceled`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}

export const getOrderReceiptApi = async (id) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/order/${id}/invoice`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}

export const orderApi = async (order) => {
    try {
        console.log("starttttttttttttttttttttttttttt")
        let response = await Api.post(`${API_ENDPOINT}/order`, order);
        console.log("starttttttttttttttttttttttttttt1111111111", response)
        if (response.ok) {
            console.log("starttttttttttttttttttttttttttt222222222222222")
            return response;
        }
        throw response;
    }
    catch (error) {
        console.log("starttttttttttttttttttttttttttt3333333333333333333333")
        throw error;
    }
}


export const AddBalanceApi = async (order) => {
    try {
        console.log("startttttttttttAddBalanceApittttttttttt")
        let response = await Api.post(`${API_ENDPOINT}/payment/wallet`, order);
        console.log("startttttttttttttAddBalanceApitttttttt1111111111", response)
        if (response.ok) {
            console.log("startttttttttttAddBalanceApittttttttt222222222222222")
            return response;
        }
        throw response;
    }
    catch (error) {
        console.log("starttttttttttttttAddBalanceApittttttttt3333333333333333333333")
        throw error;
    }
}

export const getNotifApi = async (page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/notif`, { page: page });
        console.log("Noti ::: ", response)
        if (response.ok) {
            return { data: response.data, pageCount: response.data.pageCount };
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const confirmPromoCodeApi = async (code) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/promocode/confirmPromoCode`, { code });
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const forgetPasswordByEmailApi = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/forgetPassword`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updateFavorite = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/favorites`, data);
        console.log("ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", response)
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const confirmCodeApi = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/confirmationCode`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const sendCode = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/verifyPhone`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const sendCodeFrpmProfile = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/verifyPhoneFromProfile`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const confirmChangeApi = async (data) => {
    try {
        console.log("codeeeeeeeeed", data)
        let response = await Api.put(`${API_ENDPOINT}/confirmPhoneCode`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getRatingApi = async (prodId, page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/rate?product=${prodId}`, { page: page, limit: 20 });
        if (response.ok) {
            return { data: response.data, pageCount: response.data.pageCount };
        }
        throw response.data;
    }
    catch (error) {
        console.log("ERRRO:::: ", error);
        throw error;
    }
}

export const rateProductApi = async (id, data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/product/${id}/rate`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const incrementShareCountApi = async () => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/companies/share`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getComplaintsChatApi = async (userId, page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/chat/complaintslastChats`, { page: page, limit: 20 });
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const createComplaintApi = async (data) => {
    try {
        let response = await Api.post(`${API_ENDPOINT}/complaint`, data);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getChatForComplaintApi = async (complaintId, page = 1) => {
    try {
        let response = await Api.get(`${API_ENDPOINT}/chat/specificChat?complaint=${complaintId}`, { page: page, limit: 20 });
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}

export const createMessageOnComplaintApi = async (data) => {
    const formData = new FormData();
    if (data.text) {
        formData.append('text', data.text);
    }
    if (data.file) {
        formData.append('file', data.file);
    }
    formData.append('complaint', data.complaint);
    try {
        let response = await Api.post(`${API_ENDPOINT}/chat/complaint`, formData);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("errrrrrrr", error)
        throw error;
    }
}

export const deleteAccountApi = async () => {
    try {
        let response = await Api.delete(`${API_ENDPOINT}/account`);
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        throw error;
    }
}


export const deleteFavorite = async (id) => {
    try {
        console.log("idddddddddddd", id)
        let response = await Api.delete(`${API_ENDPOINT}/favorites`, {}, { data: { product: id } });
        console.log("reeeeeeeeeeeeeeeeeee", response)
        // console.log("dataaaaaaaaaaaaa",data)
        if (response.ok) {
            return response.data;
        }
        throw response.data;
    }
    catch (error) {
        console.log("reeeeeeeeeeeeeeeeeeeeeeetttttttttttt", error)
        throw error;
    }
}