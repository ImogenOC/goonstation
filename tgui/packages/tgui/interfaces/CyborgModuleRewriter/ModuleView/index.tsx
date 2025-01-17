/**
 * @file
 * @copyright 2020
 * @author Mordent (https://github.com/mordent-goonstation)
 * @license ISC
 */

import { Button, Section, Stack, Tabs } from '../../../components';
import { EmptyPlaceholder } from '../EmptyPlaceholder';
import { ModuleDetail } from './ModuleDetail';
import { ModulesData } from '../type';

// width hard-coded to allow display of widest current module name
// without resizing when ejected/reset
const ModuleListWidth = 20;

interface ModuleViewProps {
  modules: ModulesData,
  onEjectModule: (moduleRef: string) => void,
  onMoveToolDown: (moduleRef: string, toolRef: string) => void,
  onMoveToolUp: (moduleRef: string, toolRef: string) => void,
  onRemoveTool: (moduleRef: string, toolRef: string) => void,
  onResetModule: (moduleRef: string, moduleId: string) => void,
  onSelectModule: (moduleRef: string) => void,
}

export const ModuleView = (props: ModuleViewProps) => {
  const {
    modules: {
      available = [],
      selected,
    } = {},
    onEjectModule,
    onMoveToolDown,
    onMoveToolUp,
    onRemoveTool,
    onResetModule,
    onSelectModule,
  } = props;
  const {
    ref: selectedModuleRef,
    tools = [],
  } = selected || {};

  const handleMoveToolDown = (toolRef: string) => onMoveToolDown(selectedModuleRef, toolRef);
  const handleMoveToolUp = (toolRef: string) => onMoveToolUp(selectedModuleRef, toolRef);
  const handleRemoveTool = (toolRef: string) => onRemoveTool(selectedModuleRef, toolRef);
  const handleResetModule = (moduleId: string) => onResetModule(selectedModuleRef, moduleId);

  if (available.length === 0) {
    return (
      <Section fill>
        <EmptyPlaceholder>No modules inserted</EmptyPlaceholder>
      </Section>
    );
  }
  return (
    <Stack fill>
      <Stack.Item width={ModuleListWidth}>
        <Section title="Modules" scrollable fill>
          <Tabs vertical>
            {
              available.map(module => {
                const {
                  ref: moduleRef,
                  name,
                } = module;
                const ejectButton = (
                  <Button
                    icon="eject"
                    color="transparent"
                    onClick={() => onEjectModule(moduleRef)}
                    title={`Eject ${name}`}
                  />
                );
                return (
                  <Tabs.Tab
                    key={moduleRef}
                    onClick={() => onSelectModule(moduleRef)}
                    rightSlot={ejectButton}
                    selected={moduleRef === selectedModuleRef}
                  >
                    {name}
                  </Tabs.Tab>
                );
              })
            }
          </Tabs>
        </Section>
      </Stack.Item>
      <Stack.Item grow>
        {
          selectedModuleRef
            ? (
              <ModuleDetail
                onMoveToolDown={handleMoveToolDown}
                onMoveToolUp={handleMoveToolUp}
                onRemoveTool={handleRemoveTool}
                onResetModule={handleResetModule}
                tools={tools}
              />
            )
            : (
              <Section fill>
                <EmptyPlaceholder>No module selected</EmptyPlaceholder>
              </Section>
            )
        }
      </Stack.Item>
    </Stack>
  );
};
