const express = require('express');
const {
    createUser,
    loginUser,
    getAllUser,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    loginAdmin,
    getWishList,
    saveAdress,
    userCart,
    getUserCart,
    emptyCart,
    giamGia,
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderByUserId,
    removeProductFormCart,
    updateProductFormCart,
    getMonthWiseOrderIncome,
    getMonthWiseOrderCount,
    getYearlyTotalOrders,
    updateRoleUser,
    loginBrand,
    exportUserTitle,
    forgotPasswordToken
} = require('../controller/useCtrl');
const {
    authMiddWare,
    isAdmin
} = require('../middleware/authMiddWare');
const { checkout, paymentVerification } = require('../controller/paymentCtrl');
const router = express.Router();



router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.post('/brand-login', loginBrand);
router.post("/forgot-password-token", forgotPasswordToken);
router.put('/password', authMiddWare, updatePassword);

router.get('/getmyorders', authMiddWare, getMyOrders);
/*router.put("/order/update-order/:id", authMiddWare, isAdmin, updateOrderStatus);
router.get('/all-oders', authMiddWare,isAdmin, getAllOrders);
router.get('/get-oders/:id', authMiddWare, isAdmin, getOrderByUserId);
router.post("/giamgia", authMiddWare, giamGia);
router.post('/cart/cash-order', authMiddWare, createOrder);
*/
router.get('/wishlist', authMiddWare, getWishList);
router.get('/export-user-title', exportUserTitle)
router.post('/cart', authMiddWare, userCart);


router.get('/cart', authMiddWare, getUserCart);


router.get('/all-users', getAllUser);
router.post('/cart/create-order', authMiddWare, createOrder)
router.get('/refresh', handleRefreshToken);
router.get("/logout", logout);
router.get('/:id', authMiddWare, isAdmin, getaUser);
router.get('/getMonthWiseOrderIncome', authMiddWare, getMonthWiseOrderIncome);
router.get('/getMonthWiseOrderCount', authMiddWare, getMonthWiseOrderCount);
router.get('/getYearlyTotalOrders', authMiddWare, getYearlyTotalOrders);

/*router.delete('/empty-cart', authMiddWare, emptyCart);*/
router.delete('/delete-product-cart/:cartItemId', authMiddWare, removeProductFormCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity', authMiddWare, updateProductFormCart);
router.delete('/:id', deleteUser);
router.put('/edit-role/:id', authMiddWare, isAdmin, updateRoleUser);
router.put('/edit-user', authMiddWare, isAdmin, updateUser);
router.put('/address', authMiddWare, isAdmin, saveAdress);
router.put('/block-user/:id', authMiddWare, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddWare, isAdmin, unblockUser);

router.post('/order/checkout', authMiddWare,checkout);
router.post('/order/paymentVerification', authMiddWare, paymentVerification);



module.exports = router;