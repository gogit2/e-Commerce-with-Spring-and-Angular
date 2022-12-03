package com.ahmoh.ecommerce.service;

import com.ahmoh.ecommerce.dao.CustomerRepository;
import com.ahmoh.ecommerce.dto.Purchase;
import com.ahmoh.ecommerce.dto.PurchaseResponse;
import com.ahmoh.ecommerce.entity.Address;
import com.ahmoh.ecommerce.entity.Customer;
import com.ahmoh.ecommerce.entity.Order;
import com.ahmoh.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepo;

    public CheckoutServiceImpl(CustomerRepository customerRepo){
        this.customerRepo = customerRepo;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order info from db
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        Address shippingAddress = purchase.getShippingAddress();
        Address billingAddress = purchase.getBillingAddress();
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);

        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to the database
        customerRepo.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
