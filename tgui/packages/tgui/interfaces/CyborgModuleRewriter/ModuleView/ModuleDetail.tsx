/**
 * @file
 * @copyright 2020
 * @author Mordent (https://github.com/mordent-goonstation)
 * @license ISC
 */

import { useLocalState } from '../../../backend';
import { Button, Section, Stack } from '../../../components';
import { Tools } from './Tools';
import { ToolData } from '../type';

const resetOptions = [
  {
    id: 'brobocop',
    name: 'Brobocop',
  }, {
    id: 'science',
    name: 'Science',
  }, {
    id: 'civilian',
    name: 'Civilian',
  }, {
    id: 'engineering',
    name: 'Engineering',
  }, {
    id: 'medical',
    name: 'Medical',
  }, {
    id: 'mining',
    name: 'Mining',
  },
];

interface ModuleProps {
  onMoveToolDown: (toolRef: string) => void,
  onMoveToolUp: (toolRef: string) => void,
  onRemoveTool: (toolRef: string) => void,
  onResetModule: (moduleId: string) => void,
  tools: ToolData[],
}

export const ModuleDetail = (props: ModuleProps, context) => {
  const {
    onMoveToolDown,
    onMoveToolUp,
    onRemoveTool,
    onResetModule,
    tools,
  } = props;
  const [selectedToolRef, setSelectedToolRef] = useLocalState<string | undefined>(context, 'selectedToolRef', undefined);
  const handleRemoveTool = (toolRef: string) => {
    const toolIndex = tools.findIndex(tool => tool.ref === toolRef);
    setSelectedToolRef(tools[toolIndex + 1]?.ref);
    onRemoveTool(toolRef);
  };
  const resolvedSelectedToolRef = selectedToolRef && tools.find(tool => tool.ref === selectedToolRef)?.ref;
  if (selectedToolRef && !resolvedSelectedToolRef) {
    setSelectedToolRef(undefined);
  }
  const toolsButtons = (
    <OrganizeButtons
      itemRef={resolvedSelectedToolRef}
      onMoveDown={onMoveToolDown}
      onMoveUp={onMoveToolUp}
      onRemove={handleRemoveTool}
    />
  );
  return (
    <Stack vertical fill>
      <Stack.Item>
        <Section title="Reset">
          {
            resetOptions.map(resetOption => {
              const {
                id,
                name,
              } = resetOption;
              return (
                <Button
                  key={id}
                  onClick={() => onResetModule(id)}
                  title={name}
                >
                  {name}
                </Button>
              );
            })
          }
        </Section>
      </Stack.Item>
      <Stack.Item grow>
        <Section fill scrollable title="Tools" buttons={toolsButtons}>
          <Tools tools={tools} selectedToolRef={resolvedSelectedToolRef} onSelectTool={setSelectedToolRef} />
        </Section>
      </Stack.Item>
    </Stack>
  );
};

interface OrganizeButtonsProps {
  onMoveDown: (itemRef: string) => void;
  onMoveUp: (itemRef: string) => void;
  onRemove: (itemRef: string) => void;
  itemRef: string | undefined;
}

const OrganizeButtons = (props: OrganizeButtonsProps) => {
  const { onMoveDown, onMoveUp, onRemove, itemRef } = props;
  const isItemSelected = !!itemRef;
  const handleMoveUpClick = () => onMoveUp(itemRef);
  const handleMoveDownClick = () => onMoveDown(itemRef);
  const handleRemoveClick = () => onRemove(itemRef);
  return (
    <>
      <Button icon="arrow-up" disabled={!isItemSelected} onClick={handleMoveUpClick} title="Move Up" />
      <Button icon="arrow-down" disabled={!isItemSelected} onClick={handleMoveDownClick} title="Move Down" />
      <Button icon="trash" disabled={!isItemSelected} onClick={handleRemoveClick} title="Remove" />
    </>
  );
};
