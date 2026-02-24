"use client";

import { useActionState } from "react";
import { createPriceAlert } from "@/app/actions/alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  productId: number;
};

const initialState = null;

export function PriceAlertForm({ productId }: Props) {
  const [state, formAction] = useActionState(createPriceAlert, initialState);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Alerta de precio</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="productId" value={productId} />

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="tu-email@ejemplo.com"
              required
            />
            {state?.fieldErrors?.email && (
              <p className="text-xs text-red-600">{state.fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="targetPrice">
              Precio deseado
            </label>
            <input
              id="targetPrice"
              name="targetPrice"
              type="text"
              inputMode="decimal"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Ej: 299,99"
              required
            />
            {state?.fieldErrors?.targetPrice && (
              <p className="text-xs text-red-600">
                {state.fieldErrors.targetPrice}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Avísame cuando baje
          </Button>

          {state && (
            <p
              className={`text-sm mt-2 ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

