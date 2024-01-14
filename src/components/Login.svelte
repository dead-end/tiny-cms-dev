<script lang="ts">
  import { repoConfigStore } from "../ts/stores/repoConfig";
  import { createFormValidator } from "../ts/validation/formValidator";
  import {
    requiredValidator,
    type TValidator,
  } from "../ts/validation/validators";

  import FormWrapper from "./FormWrapper.svelte";
  import TextInput from "./TextInput.svelte";

  let token = "";

  const formValidators: Record<string, TValidator[]> = {
    token: [requiredValidator],
  };

  let { formErrors, validateForm } = createFormValidator(formValidators);

  const submit = (event: Event) => {
    const formData = new FormData(event.target as HTMLFormElement);

    if (!validateForm(formData)) {
      formErrors = formErrors;
      return;
    }

    console.log("submit");
    repoConfigStore.login("token");
  };
</script>

<div class="w-full max-w-xs m-auto">
  <FormWrapper label="Login" {submit}>
    <TextInput
      id="token"
      value={token}
      error={formErrors["token"]}
      type="password"
    />
  </FormWrapper>
</div>
