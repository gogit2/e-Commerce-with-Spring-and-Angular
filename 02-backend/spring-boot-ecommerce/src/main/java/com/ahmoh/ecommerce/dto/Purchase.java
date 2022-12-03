package com.ahmoh.ecommerce.dto;

import com.ahmoh.ecommerce.entity.Address;
import com.ahmoh.ecommerce.entity.Customer;
import com.ahmoh.ecommerce.entity.Order;
import com.ahmoh.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
