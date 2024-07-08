import {ExpensiMark} from 'expensify-common';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import RenderHTML from '@components/RenderHTML';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useNetSuiteCustomFieldAddFormSubmit from '@hooks/useNetSuiteCustomFieldAddFormSubmit';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import type {CustomFieldSubStepWithPolicy} from '@pages/workspace/accounting/netsuite/types';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NetSuiteCustomFieldForm';

const parser = new ExpensiMark();

function CustomSegmentScriptIdStep({onNext, isEditing, policy}: CustomFieldSubStepWithPolicy) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const handleSubmit = useNetSuiteCustomFieldAddFormSubmit({
        fieldIds: [INPUT_IDS.SCRIPT_ID],
        onNext,
        shouldSaveDraft: isEditing,
    });

    const [formValuesDraft] = useOnyx(ONYXKEYS.FORMS.NETSUITE_CUSTOM_FIELD_ADD_FORM_DRAFT);
    const customSegmentRecordType = formValuesDraft?.[INPUT_IDS.CUSTOM_SEGMENT_TYPE] ?? CONST.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT;

    const fieldLabel = translate(
        `workspace.netsuite.import.importCustomFields.customSegments.fields.${
            customSegmentRecordType === CONST.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_SEGMENT ? 'scriptID' : 'customRecordScriptID'
        }`,
    );

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NETSUITE_CUSTOM_FIELD_ADD_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NETSUITE_CUSTOM_FIELD_ADD_FORM> => {
            const errors: FormInputErrors<typeof ONYXKEYS.FORMS.NETSUITE_CUSTOM_FIELD_ADD_FORM> = {};
            if (!ValidationUtils.isRequiredFulfilled(values[INPUT_IDS.SCRIPT_ID])) {
                errors[INPUT_IDS.SCRIPT_ID] = translate('workspace.netsuite.import.importCustomFields.requiredFieldError', fieldLabel);
            } else if (
                policy?.connections?.netsuite?.options?.config?.syncOptions?.customSegments?.find(
                    (customSegment) => customSegment.scriptID.toLowerCase() === values[INPUT_IDS.SCRIPT_ID].toLowerCase(),
                )
            ) {
                errors[INPUT_IDS.SCRIPT_ID] = translate('workspace.netsuite.import.importCustomFields.customSegments.errors.uniqueFieldError', fieldLabel);
            }
            return errors;
        },
        [fieldLabel, policy?.connections?.netsuite?.options?.config?.syncOptions?.customSegments, translate],
    );

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NETSUITE_CUSTOM_FIELD_ADD_FORM}
            submitButtonText={translate('common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.flexGrow1, styles.ph5]}
            submitButtonStyles={[styles.mb0]}
        >
            <Text style={[styles.mb3, styles.textHeadlineLineHeightXXL]}>
                {translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.${customSegmentRecordType}ScriptIDTitle`)}
            </Text>
            <InputWrapper
                InputComponent={TextInput}
                inputID={INPUT_IDS.SCRIPT_ID}
                shouldSaveDraft={!isEditing}
                label={fieldLabel}
                aria-label={fieldLabel}
                role={CONST.ROLE.PRESENTATION}
                spellCheck={false}
            />
            <View style={[styles.flex1, styles.mv3, styles.renderHTML, styles.textDecorationSkipInkNone]}>
                <RenderHTML
                    html={`<comment>${parser.replace(translate(`workspace.netsuite.import.importCustomFields.customSegments.addForm.${customSegmentRecordType}ScriptIDFooter`))}</comment>`}
                />
            </View>
        </FormProvider>
    );
}

CustomSegmentScriptIdStep.displayName = 'CustomSegmentScriptIdStep';
export default CustomSegmentScriptIdStep;
