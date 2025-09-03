import React from 'react';
import BannerUpload from './BannerUpload';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

import { useTranslation } from 'react-i18next';

const BannerEvent = ({
  label,
  name,
  onChange,
  header = '',
  text = '',
  link = '',
  imagePreview = '',
  onFieldChange,
  errors = {},
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full space-y-2">
      <label className="block font-semibold mb-1">{label}</label>
      <BannerUpload
        label={label}
        imagePreview={imagePreview}
        onFileChange={(file, preview) => onChange({ name, file, preview })}
      />
      <div>
        <InputLabel htmlFor={`header_${name}`} value={"Header"} />
        <TextInput
          id={`header_${name}`}
          name={`header_${name}`}
          value={header}
          onChange={onFieldChange}
          className="mt-1 block w-full"
          autoComplete={`header_${name}`}
          placeholder={t("setting.bannerEventHeaderPlaceholder")}
          required={true}
        />
        <InputError message={errors[`header_${name}`]} className="mt-2" />
      </div>
      <div>
        <InputLabel htmlFor={`text_${name}`} value={"Text"} />
        <TextInput
          id={`text_${name}`}
          name={`text_${name}`}
          value={text}
          onChange={onFieldChange}
          className="mt-1 block w-full"
          autoComplete={`text_${name}`}
          placeholder={t("setting.bannerEventTextPlaceholder")}
          required={true}
        />
        <InputError message={errors[`text_${name}`]} className="mt-2" />
      </div>
      <div>
        <InputLabel htmlFor={`link_${name}`} value={"Link"} />
        <TextInput
          id={`link_${name}`}
          name={`link_${name}`}
          value={link}
          onChange={onFieldChange}
          className="mt-1 block w-full"
          autoComplete={`link_${name}`}
          pattern="https://.*"
          title="Link harus diawali dengan https://"
          placeholder="https://example.com"
          required={true}
        />
        <InputError message={errors[`link_${name}`]} className="mt-2" />
      </div>
    </div>
  );
};

export default BannerEvent;