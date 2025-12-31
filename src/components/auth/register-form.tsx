"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "@/hooks/use-location";
import { register } from "@/actions/register";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { states, cities, countries, isLoadingStates, isLoadingCities, isLoadingCountries, fetchCities } = useLocation();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      city: "",
      state: "",
      region: "",
      country: "Brasil",
      structure: "",
      otherStructure: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  const structureOptions = [
    "Louvor / NewBreed",
    "GAD",
    "SOS",
    "Intercessão",
    "FlareUp",
    "Discipulado",
    "Secretariado",
    "GOE",
    "ON THE MOVE",
    "Visita",
    "Outro",
  ];

  return (
    <CardWrapper
      headerLabel="Crie uma conta"
      backButtonLabel="Já tem uma conta?"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="João da Silva"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="joao@exemplo.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select
                        disabled={isPending || isLoadingCountries}
                        onValueChange={(value) => {
                            field.onChange(value);
                            // Reset state and city when country changes to avoid invalid combinations
                            form.setValue("state", "");
                            form.setValue("city", "");
                        }}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {countries.map((country) => (
                                <SelectItem key={country.id} value={country.nome}>
                                    {country.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estado</FormLabel>
                    {form.watch("country") === "Brasil" ? (
                        <Select
                            disabled={isPending || isLoadingStates}
                            onValueChange={(value) => {
                                field.onChange(value);
                                fetchCities(value);
                                form.setValue("city", "");
                            }}
                            defaultValue={field.value}
                            value={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {states.map((state) => (
                                    <SelectItem key={state.id} value={state.sigla}>
                                        {state.sigla}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Estado/Província"
                            />
                        </FormControl>
                    )}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    {form.watch("country") === "Brasil" ? (
                        <Select
                            disabled={isPending || isLoadingCities || !form.getValues("state")}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.nome}>
                                        {city.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     ) : (
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Cidade"
                            />
                        </FormControl>
                    )}
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
                control={form.control}
                name="structure"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estrutura</FormLabel>
                    <Select
                        disabled={isPending}
                        onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "Outro") {
                                form.setValue("otherStructure", "");
                            }
                        }}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a estrutura" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {structureOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {form.watch("structure") === "Outro" && (
                <FormField
                    control={form.control}
                    name="otherStructure"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Qual?</FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Especifique..."
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                        <Input
                        {...field}
                        disabled={isPending}
                        placeholder="(11) 99999-9999"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Núcleo (Opcional)</FormLabel>
                    <FormControl>
                        <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Zona Sul"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#f25c08]"
          >
            Criar conta
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
