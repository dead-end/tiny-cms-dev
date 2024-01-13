<script lang="ts">
  import { repoConfigStore } from "../ts/stores/repoConfig";
  import { useForm } from "../ts/validators/valid";
  import {
    requiredValidator,
    type TValidator,
  } from "../ts/validators/validators";

  import FormWrapper from "./FormWrapper.svelte";
  import TextInput from "./TextInput.svelte";

  let token = "";

  const fieldValidators: Record<string, TValidator[]> = {
    token: [requiredValidator],
  };

  let { fieldErrors, validateForm } = useForm(fieldValidators);

  const submit = (event: Event) => {
    const formData = new FormData(event.target as HTMLFormElement);

    if (!validateForm(formData)) {
      fieldErrors = fieldErrors;
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
      error={fieldErrors["token"]}
      type="password"
    />
  </FormWrapper>
</div>
