import { useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts } from "pdf-lib";
import React from "react";
import InputMask from "react-input-mask";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
  Stack,
  Flex,
  CircularProgress,
  Select,
  InputRightElement,
  useToast
} from "@chakra-ui/react";


const SourceFileUrl = "https://alexjsanches.github.io/monaiza/FIC+DS.pdf";

const IndexPage = () => {
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    razao_social: "",
    porte: "",
    cpf_cnpj:"",
    tit_nome:"",
    tit_dn:"",
    tit_sexo:"",
    tit_estcivil:"",
    tit_nomemae:"",
    tit_nacionalidade:"",
    tit_ufnatural:"",
    tit_cidadenatural:"",
    tit_cep:"",
    tit_cidade:"",
    tit_uf:"",
    tit_logradouro:"",
    tit_numero:"",
    tit_complemento:"",
    tit_bairro:"",
    tit_celular:"",
    tit_email:"",
    tit_cpf:"",
    tit_rg:"",
    tit_emissor_rg:"",
    tit_dt_emissao:"",
    tit_dnv:"",
    tit_cns:"",
  });
  const [loading, setLoading] = useState(false);

  const enviarFormulario = async () => {
    setLoading(true); // set loading to true

    // Carrega o arquivo PDF de origem
    const pdfDoc = await PDFDocument.load(await fetch(SourceFileUrl).then(res => res.arrayBuffer()));

    const fieldValues = [
      { fieldName: "razao_social", value: formValues.razao_social },
      { fieldName: "tit_email", value: formValues.tit_email },
      { fieldName: "tit_celular", value: formValues.tit_celular },
      { fieldName: "tit_sexo", value: formValues.tit_sexo === "M" ? "M" : "F" },
      { fieldName: "tit_dn", value: formValues.tit_dn },
      { fieldName: "cpf_cnpj", value: formValues.cpf_cnpj },
    ];
    

    // Preenche os campos do formulário
    const form = pdfDoc.getForm();

    fieldValues.forEach((field) => {
      form.getTextField(field.fieldName).setText(field.value);
    });

    // Salva o arquivo PDF preenchido no disco rígido
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "FIC+DS.pdf");

    setLoading(false); // set loading to false

    // Exibe o Toast
    toast({
      title: "PDF gerado com sucesso",
      status: "success",
      duration: 3000,
      isClosable: false,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  function PasswordInput() {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          variant={"filled"}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Esconder" : "Mostrar"}
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  }

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Stack spacing={3}>
        <FormControl>
          <FormLabel>CNPJ</FormLabel>
          <InputMask
            mask="99.999.999/9999-99"
            variant="filled"
            name="cpf_cnpj"
            value={formValues.cpf_cnpj}
            onChange={handleChange}
          >
            {(inputProps) => <Input {...inputProps} />}
          </InputMask>
          <FormLabel>Razão Social</FormLabel>
          <Input
            variant="filled"
            name="razao_social"
            value={formValues.razao_social}
            onChange={handleChange}
          />
          <FormLabel>Email</FormLabel>
          <Input
            variant="filled"
            name="tit_email"
            value={formValues.tit_email}
            onChange={handleChange}
            type="email"
          />
          <FormLabel>Celular</FormLabel>
          <InputMask
            mask="(99) 99999-9999"
            variant="filled"
            name="tit_celular"
            value={formValues.tit_celular}
            onChange={handleChange}
          >
            {(inputProps) => <Input {...inputProps} />}
          </InputMask>
          <FormLabel>Sexo</FormLabel>
          <Select
            variant="filled"
            placeholder="Selecione"
            name="tit_sexo"
            value={formValues.porte}
            onChange={handleSelectChange}
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </Select>
          <FormLabel>Senha</FormLabel>
          <PasswordInput />
          <FormLabel>Data</FormLabel>
          <Input variant={'filled'} type="date" defaultValue={formValues.tit_dn} onChange={handleChange}/>

          <Button colorScheme={"messenger"} onClick={enviarFormulario} mt={4}>
            Enviar
          </Button>
        </FormControl>

        {loading && (
          <Flex justifyContent="center">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default IndexPage;
