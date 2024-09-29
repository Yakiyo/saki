set positional-arguments

alias b := build
alias gb := grbuild
alias u := update
alias r := run

default:
  @just --list

@run *arg:
    go run main.go $@

test:
	go test ./...

build:
	go build -o saki main.go

fmt:
	go fmt ./...

update:
	go get
	go mod tidy

# build with goreleaser for current arch
grbuild:
	goreleaser build --single-target --clean --snapshot -o saki