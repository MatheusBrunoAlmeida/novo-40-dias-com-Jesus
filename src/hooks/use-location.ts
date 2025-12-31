import { useState, useEffect } from "react";

interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGEMunicipioResponse {
  id: number;
  nome: string;
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
}

export interface City {
  id: number;
  nome: string;
}

export interface Country {
  id: number;
  nome: string;
}

export const useLocation = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/paises?orderBy=nome"
        );
        const data: Country[] = await response.json();
        setCountries(
          data.map((country) => ({
            id: country.id,
            nome: country.nome,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data: IBGEUFResponse[] = await response.json();
        setStates(
          data.map((uf) => ({
            id: uf.id,
            sigla: uf.sigla,
            nome: uf.nome,
          }))
        );
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchCountries();
    fetchStates();
  }, []);

  const fetchCities = async (uf: string) => {
    if (!uf) {
      setCities([]);
      return;
    }

    setIsLoadingCities(true);
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      );
      const data: IBGEMunicipioResponse[] = await response.json();
      setCities(
        data.map((city) => ({
          id: city.id,
          nome: city.nome,
        }))
      );
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  };

  return {
    countries,
    states,
    cities,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    fetchCities,
  };
};
