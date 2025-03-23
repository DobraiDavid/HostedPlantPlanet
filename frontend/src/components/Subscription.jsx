import React from "react";

const Subscription = ({ plan, onSubscribe }) => {
  if (!plan) {
    return <div>Plan data is missing</div>; 
  }

  return (
    <div className={styles.subscriptionCard}>
      <h2 className={styles.subscriptionTitle}>{plan.name}</h2>
      <p className={styles.subscriptionPrice}>{plan.price}</p>
      <ul className={styles.subscriptionBenefits}>
        {plan.benefits?.length > 0 ? (
          plan.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))
        ) : (
          <li>No benefits available</li> 
        )}
      </ul>
      <button className={styles.subscribeButton} onClick={() => onSubscribe(plan)}>
        Előfizetés
      </button>
    </div>
  );
};

export default Subscription;
