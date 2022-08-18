import React from "react";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PhoneCodes } from "../config";

const schema = yup.object().shape({
  code: yup.string(), // Здесь можно добавить валидацию для селекта, если он будет доступен для ввода пользователем
  phone: yup
    .string()
    .required("Обязательное поле")
    .matches("^[0-9]+$", "Поле должно содержать только цифры")
    .min(3, "Мин длинна 3 цифры")
    .max(10, "Макс длинна 10 цифр"),
});

export const PhoneNumber = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    const { code, phone } = getValues();
    console.log(getValues);
    fetch("/phones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: v4(), phone: `${code} ${phone}` }),
    })
      .then(() => reset())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <form
        className="flex flex-col my-10 justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row">
          <select
            name="code"
            {...register("code")}
            className="border rounded-sm border-black"
          >
            {PhoneCodes.map((el) => {
              return (
                <option key={el} value={el}>
                  {el}
                </option>
              );
            })}
          </select>

          <input
            {...register("phone")}
            className="border rounded-sm border-black pl-2 mr-4"
          />

          <input
            type="submit"
            className="border rounded-md border-black px-8 bg-lime-300"
          />
        </div>
        <p>{errors.phone?.message}</p>
      </form>
    </>
  );
};
