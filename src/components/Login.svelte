<script lang="ts">
  import { repoConfigStore } from "../ts/stores/repoConfig";
  import { formDataStrValue } from "../ts/utils";
  import { createFormValidator } from "../ts/validation/formValidator";
  import {
    requiredValidator,
    type TValidator,
  } from "../ts/validation/validators";

  import FormWrapper from "./FormWrapper.svelte";
  import TextInput from "./TextInput.svelte";

  const formValidators: Record<string, TValidator[]> = {
    password: [requiredValidator],
  };

  let { formErrors, validateForm } = createFormValidator(formValidators);

  const submit = (event: Event) => {
    const formData = new FormData(event.target as HTMLFormElement);

    if (!validateForm(formData)) {
      formErrors = formErrors;
      return;
    }

    console.log("submit");

    repoConfigStore.login(formDataStrValue(formData.get("password")));
  };
</script>

<div class="w-full max-w-xs m-auto">
  <FormWrapper label="Login" {submit}>
    <TextInput
      label="Password"
      id="password"
      value=""
      error={formErrors["password"]}
      type="password"
    />
  </FormWrapper>
</div>
