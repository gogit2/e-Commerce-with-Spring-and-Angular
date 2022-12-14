package com.ahmoh.ecommerce.config;

import com.ahmoh.ecommerce.entity.Country;
import com.ahmoh.ecommerce.entity.Product;
import com.ahmoh.ecommerce.entity.ProductCategory;
import com.ahmoh.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.ExposureConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable HTTP methods for Product: Put, Post, Delete
        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(Product.class), theUnsupportedActions);

        // disable HTTP methods for ProductCategory: Put, Post, Delete
        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(ProductCategory.class), theUnsupportedActions);

        // disable HTTP methods for Countries: Put, Post, Delete
        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(Country.class), theUnsupportedActions);

        // disable HTTP methods for States: Put, Post, Delete
        disableHttpMethods(config.getExposureConfiguration()
                .forDomainType(State.class), theUnsupportedActions);

        // call an internal helper method
        exposeIds(config);
    }

    private static void disableHttpMethods(ExposureConfigurer config, HttpMethod[] theUnsupportedActions) {
        config
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // expose entity ids

        Set<EntityType<?>> entityTypes = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        for (EntityType tempEntityType : entityTypes)
            entityClasses.add(tempEntityType.getJavaType());

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
