
/**
 * Service pour gérer les achats In-App (Google Play & Apple App Store)
 * ID de produit à configurer dans les consoles développeur : 'sub_mastermind_monthly'
 */

declare const store: any;

export const PRODUCT_ID = 'sub_mastermind_monthly';

export const initBilling = (onPurchaseSuccess: () => void) => {
  if (typeof store === 'undefined') {
    console.warn("Store not available (running in browser?)");
    return;
  }

  // Configuration du produit
  store.register({
    id: PRODUCT_ID,
    type: store.PAID_SUBSCRIPTION,
  });

  // Gestion de la validation
  store.when(PRODUCT_ID).approved((p: any) => {
    console.log("Achat approuvé par le store");
    p.verify();
  });

  store.when(PRODUCT_ID).verified((p: any) => {
    console.log("Achat vérifié avec succès");
    p.finish();
    onPurchaseSuccess();
  });

  store.when(PRODUCT_ID).updated((p: any) => {
    if (p.owned) {
      onPurchaseSuccess();
    }
  });

  store.error((error: any) => {
    console.error("Billing Error: " + error.code + " - " + error.message);
  });

  // Actualisation pour vérifier les abonnements existants
  store.refresh();
};

export const requestPurchase = () => {
  if (typeof store !== 'undefined') {
    store.order(PRODUCT_ID);
  } else {
    alert("Simulation: Purchase requested in browser.");
  }
};
