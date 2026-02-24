import * as React from "react";

type PriceAlertEmailProps = {
  productName: string;
  currentPrice: number;
  productUrl?: string | null;
  isConfirmation?: boolean;
};

export function PriceAlertEmail({
  productName,
  currentPrice,
  productUrl,
  isConfirmation = false,
}: PriceAlertEmailProps) {
  const formattedPrice = `${currentPrice.toFixed(2)}€`;

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: "20px", margin: "0 0 12px" }}>
          {isConfirmation
            ? "Has creado una alerta de precio en Comparer"
            : "¡El precio de tu producto ha bajado!"}
        </h1>

        <p style={{ fontSize: "14px", margin: "0 0 8px" }}>
          Hola,
        </p>

        {isConfirmation ? (
          <p style={{ fontSize: "14px", margin: "0 0 12px" }}>
            Hemos registrado tu alerta de precio para el siguiente producto:
          </p>
        ) : (
          <p style={{ fontSize: "14px", margin: "0 0 12px" }}>
            El producto que estabas siguiendo ha bajado de precio:
          </p>
        )}

        <p style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 4px" }}>
          {productName}
        </p>
        <p style={{ fontSize: "14px", margin: "0 0 12px" }}>
          Precio actual: <strong>{formattedPrice}</strong>
        </p>

        {productUrl && (
          <p style={{ fontSize: "14px", margin: "0 0 16px" }}>
            Puedes ver la oferta haciendo clic en el siguiente enlace:
            <br />
            <a href={productUrl} style={{ color: "#ea580c" }}>
              Ver producto en la tienda
            </a>
          </p>
        )}

        {!isConfirmation && (
          <p style={{ fontSize: "13px", margin: "0 0 8px", color: "#555" }}>
            Te enviamos este correo porque configuraste una alerta de precio en Comparer.
          </p>
        )}

        <p style={{ fontSize: "12px", margin: "16px 0 0", color: "#888" }}>
          Si no deseas recibir más alertas para este producto, puedes ignorar este
          mensaje o desactivar la alerta desde tu cuenta cuando esté disponible.
        </p>
      </div>
    </div>
  );
}

