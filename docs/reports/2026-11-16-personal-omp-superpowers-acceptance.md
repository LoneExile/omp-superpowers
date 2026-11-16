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

## Глобальное переключение

- Main личного GitHub-форка опубликован без force. Установлен immutable source `github:YarikMix/omp-superpowers#fb0cc8c6a58b6663b34eb986b92d4b8cc0257393`; отличие от проверенного dadb7c9 — только этот отчёт.
- Оригинальный Ponytail установлен отдельно по release SHA7801d061243d7b753bad0e0b3c057cd250b11755.
- Через штатный cfg approval сохранены только пять `task.agentModelOverrides` (Sol: medium/high/low/max/max для implementer/reviewer/rereviewer/escalation/final) и `task.showResolvedModelBadge=true`. Глобальные structured/perCallModel/isolation и прочие настройки не менялись.
- Все14 проверенных vendor symlinks перемещены за пределы discovery, а не удалены вместе с исходниками. Официальный vendor сохранён.
- Свежий `omp skill list --json`:117 skills, включая14 личных Superpowers и6 оригинального Ponytail; ровно один bare receiving-code-review, владелец @omp-utils/code-review; aliases и warnings отсутствуют. Все97 посторонних skills сохранили источники.
- Проверены неизменность7 защищённых файлов (receiving, память, Codex config) и исходной linked-установки @omp-utils/code-review.
- Функциональные события, fixture, git bundle с реальными smoke-коммитами и исходник harness сохранены приватно. AuthStorage и session databases не копировались.
- Отдельный свежий Bun process завершился exit0: native discovery загрузил ровно по одному extension Superpowers, Ponytail и code-review без ошибок; все5 sdd-* ролей найдены однократно и разрешились в Sol с точными medium/high/low/max/max, без warnings или clamping. Это проверка загрузки/roster/resolution без model requests и без session_start; реальный bootstrap проверялся отдельно в изолированном live run и lifecycle tests.
- Для воспроизведения offline probe нужен `Settings.loadReadOnly({cwd})`, а не `Settings.init({readOnly:true})`: последний вызывает другой load-path и пропускает глобальный YAML при persist=false. Каталог моделей гидратируется локальным `hydrateCredentialScopedModelCaches()`, без online discovery. Пустые overrides в ошибочной заготовке probe не были проблемой сохранённой установки.
- После архивирования удалены оба собственных временных config roots, fixture repos, cloned sources, databases и throwaway scripts. В отдельном smoke supervisor перед удалением не осталось процессов (`omp ps list --all --json` → `[]`).

## Откат и новая сессия

Приватный архив: `~/.ai/omp-superpowers-cutover-20261116.zsh51mp0` (вне skill discovery). `cutover-baseline.json` фиксирует точные targets ссылок и protected hashes, `settings-touched.json` — прежние и применённые значения двух config keys; `evidence/` содержит до/после discovery, установочные результаты и smoke.

Откат — только при необходимости, сейчас не выполнялся:
1. Штатно удалить только @yarikmix/omp-superpowers и @dietrichgebert/ponytail через `omp plugin uninstall <имя>`, предварительно проверив отсутствие последующих операторских изменений.
2. Вернуть14 ссылок из `links/` на исходные пути, только если там ничего нового не появилось; receiving-code-review не восстанавливать.
3. Через cfg approval вернуть прежние значения только двух изменённых keys, сравнив текущие с applied. Не восстанавливать config/lock целиком: это затрёт независимые изменения.
4. Повторить `omp skill list --json` и проверить источник единственного receiving.

Текущая сессия не считается перезагруженной: для нового plugin bootstrap требуется новая omp-сессия.

## Решения controller ledger

- Per-call model остаётся off; разрешение модели идёт через operator-owned named-role routing, не обход ограничения API.
- Покрывающие команды задаются явно в assignments; evidence различает выполненные проверки и неподтверждённые сообщения исполнителя.
- Ponytail — отдельный pinned native plugin с per-session modes, без изобретённого наследования.
- Native eval commit capability предоставлена только двум editing seats; reviewers не расширены.
- Terminal non-acceptance сохраняется между SDD и Native executor; смена executor не обнуляет лимит и не разрешает parking невыполненного scope.
