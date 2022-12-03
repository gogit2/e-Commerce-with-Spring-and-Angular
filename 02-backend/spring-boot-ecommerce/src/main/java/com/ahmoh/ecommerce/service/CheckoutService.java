package com.ahmoh.ecommerce.service;

import com.ahmoh.ecommerce.dto.Purchase;
import com.ahmoh.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
