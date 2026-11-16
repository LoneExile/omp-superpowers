# Приёмка личного omp-superpowers

## Источники и область

- Личный форк: https://github.com/YarikMix/omp-superpowers; пакет @yarikmix/omp-superpowers@7.0.2-omp.4.
- Основа: LoneExile/omp-superpowers 7.0.2-omp.3, fad5b9e7ec578fbac11c7dbe1b251ceb1d7f19a9; исходное происхождение obra/superpowers и MIT сохранены.
- Проверяемая версия omp: 18.20.2.
- Оригинальный отдельный Ponytail 5.3.3: release commit 7801d061243d7b753bad0e0b3c057cd250b11755, совпадает с npm gitHead.
- Receiving-code-review принадлежит @omp-utils/code-review. В личном форке его каталог удалён; официальный vendor и самостоятельная реализация не редактировались.

## Выполненные проверки до глобального переключения

- Исходный baseline extension: 9/9 Node tests.
- После изменения bootstrap: `node --test tests/pi/test-pi-extension.mjs` — 9 pass, 0 fail; проверялись начальная, повторная и post-compaction доставка, отсутствие duplicate bootstrap и skip main-bootstrap у workers.
- `bash scripts/check-npm-package.sh` — 84 runtime files, корректная личная идентичность.
- Фактический `npm pack --dry-run --json`: ровно14 полных skill-директорий, receiving отсутствует, native manifest и SOURCE.md включены.
- `bash tests/sdd-helper-paths/test-sdd-helper-paths.sh` — PASS,15 helper references.
- Пять одинаковых независимых pressure controls до правки завершали задачу административно complete/parked при всё ещё невыполненном принятом требовании. Пять samples после правки выбрали not accepted без нового раунда/ревьюера. Это bounded stateless проверки поведения, не полный SDD-прогон.
- Постфиксовые recovery-сценарии SDD и Native: terminal Final:notaccepted останавливает повторное ревью даже при complete у всех задач; смена executor не сбрасывает лимиты без явного открытия пользователем.
- Независимые task-review и scoped rereview пройдены. Whole-branch reviewer нашёл пропуск второго потребителя ledger; исправление ff5896f проверено scoped reviewer, новых findings нет.

## Настоящее изолированное обнаружение пакетов

Отдельный config root и agent directory; стандартные пользовательские skills отключены только в этой временной конфигурации. Исходная глобальная установка не переключалась.

Штатные команды `omp plugin link` и `omp skill list --json` обнаружили14 skills личного Superpowers,6 отдельных skills оригинального Ponytail и ровно один receiving-code-review из @omp-utils/code-review, без upstream alias.

Затем проверен именно планируемый канал установки:

```text
omp plugin install github:YarikMix/omp-superpowers#dadb7c9961f07dd2eb0604da94653b8cdc7d8cc7 --json
omp plugin install github:DietrichGebert/ponytail#7801d061243d7b753bad0e0b3c057cd250b11755 --json
omp skill list --json
```

Обе установки выполнены в отдельном config root. Повторная проверка подтвердила14 личных skills и единственный owned receiving; установщик сохранил ранее linked @omp-utils/code-review.

## Live-smoke и найденная настоящая несовместимость

SDK использует отдельные Settings/session directories и существующий AuthStorage без экспорта/копирования секретов. Native extensions и root-scoped subagent event bus загружаются штатно. Повторная сессия сохраняется целиком на время implementation/review/fix.

Первый run:
- настоящая команда Ponytail off убрала active rules из effective system prompt; full вернула их;
- sdd-implementer изменил реальный fixture и выполнил RED/GREEN checks;
- sdd-reviewer вернул `structuredOutput.source=agent,status=valid`, а не просто JSON-похожий текст;
- независимый reviewer обнаружил реально введённый в disposable fixture validation defect;
- write agent://AllowlistImplementer продолжил того же исполнителя; тот исправил исходник, и3 покрывающих теста стали зелёными;
- приёмка корректно завершилась ошибкой `No fix commit`: host требует native eval commit namespace, которого не было в инструментах двух исполнительских ролей. Worker сообщил NEEDS_CONTEXT, не выдумал commit и не обошёл правила через shell git.

Исправление dadb7c9 добавило eval только sdd-implementer и sdd-escalation-implementer и зафиксировало native selective-commit contract. Read-only reviewers не расширены. Scoped code reviewer подтвердил устранение gap.

Повторный live run проверял dadb7c9961f07dd2eb0604da94653b8cdc7d8cc7 и записал `SMOKE_SUCCESS` 2026-11-16T17:42:25.689Z:
- реальный initial implementation commit: 9140f011a31a210bc901cb43d497a7bfcca2fdda;
- initial reviewer: approved; после прозрачной fault injection 49f8d7927dc5b1ccaa3d95c8b7db4611406b5c94 независимый reviewer: needs_fixes;
- тот же AllowlistImplementer запущен повторно с тем же session file и выпустил настоящий fix commit e22ac55d894d687d6f6c2cea59fb60cc5d8ea0f3;
- три covering tests после исправления прошли; scoped rereviewer: all_addressed;
- три результата имеют native metadata `structuredOutput.source=agent,status=valid`; два ошибочных payload rereviewer отклонены схемой до его исправленного валидного yield, а не приняты как результаты;
- четыре task dispatch и один resume действительно содержали точный абзац сохранения SDD, spec и plan paths;
- настоящие native Ponytail off/full probes прошли.

Ограничение: после записи итогового JSON и успешных assertions процесс завис при `await session.dispose()` SDK и был остановлен внешним таймаутом1500s. Это не успешное завершение команды: функциональный цикл подтверждён сохранёнными событиями и коммитами, но чистое завершение данного SDK harness не подтверждено. Runtime-код пакета ради скрытия teardown-проблемы не изменялся.

## Границы утверждений

Ponytail остаётся оригинальным плагином с режимами по сессиям: off у родителя не обещает off у свежего worker. Глобальная память не используется как единственный источник SDD-инварианта и не изменяется. При единственной выбранной модели Sol повышение до max — повышение reasoning и новый контекст, не другая более сильная модель. Skill не повышает приоритет над системными инструкциями omp.
